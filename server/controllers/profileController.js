const { pool } = require('../db');

// Récupérer le profil complet d'une famille par device ID
const getProfileByDeviceId = async (req, res) => {
    try {
        const { deviceId } = req.params;
        
        // Récupérer les informations de base de la famille
        const familyResult = await pool.query(
            `SELECT f.*, array_agg(DISTINCT i.interest) as interests 
             FROM families f 
             LEFT JOIN family_interests i ON f.id = i.family_id 
             WHERE f.device_id = $1 
             GROUP BY f.id`,
            [deviceId]
        );

        if (familyResult.rows.length === 0) {
            return res.status(404).json({ message: 'Famille non trouvée' });
        }

        const family = familyResult.rows[0];

        // Récupérer les membres de la famille avec leurs activités préférées
        const membersResult = await pool.query(
            `SELECT m.*, array_agg(DISTINCT a.activity) as preferred_activities 
             FROM family_members m 
             LEFT JOIN member_activities a ON m.id = a.member_id 
             WHERE m.family_id = $1 
             GROUP BY m.id`,
            [family.id]
        );

        family.members = membersResult.rows;

        res.json(family);
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour le profil de la famille
const updateFamilyProfile = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { family_name, family_photo_url, interests } = req.body;

        // Mettre à jour les informations de base
        const familyResult = await pool.query(
            `UPDATE families 
             SET family_name = COALESCE($1, family_name),
                 family_photo_url = COALESCE($2, family_photo_url),
                 updated_at = NOW()
             WHERE device_id = $3
             RETURNING *`,
            [family_name, family_photo_url, deviceId]
        );

        if (familyResult.rows.length === 0) {
            return res.status(404).json({ message: 'Famille non trouvée' });
        }

        const family = familyResult.rows[0];

        // Mettre à jour les intérêts si fournis
        if (interests) {
            // Supprimer les anciens intérêts
            await pool.query(
                'DELETE FROM family_interests WHERE family_id = $1',
                [family.id]
            );

            // Ajouter les nouveaux intérêts
            if (interests.length > 0) {
                const interestValues = interests.map(interest => 
                    `(${family.id}, '${interest}')`
                ).join(',');
                
                await pool.query(
                    `INSERT INTO family_interests (family_id, interest) VALUES ${interestValues}`
                );
            }
        }

        res.json(await getFullFamilyProfile(family.id));
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un membre de la famille
const updateMemberProfile = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { 
            first_name, 
            last_name,
            role, 
            birth_date,
            dietary_restrictions, 
            preferred_activities 
        } = req.body;

        // Mettre à jour les informations du membre
        const memberResult = await pool.query(
            `UPDATE family_members 
             SET first_name = COALESCE($1, first_name),
                 last_name = COALESCE($2, last_name),
                 role = COALESCE($3, role),
                 birth_date = COALESCE($4, birth_date),
                 dietary_restrictions = COALESCE($5, dietary_restrictions),
                 updated_at = NOW()
             WHERE id = $6
             RETURNING *`,
            [first_name, last_name, role, birth_date, dietary_restrictions, memberId]
        );

        if (memberResult.rows.length === 0) {
            return res.status(404).json({ message: 'Membre non trouvé' });
        }

        const member = memberResult.rows[0];

        // Mettre à jour les activités préférées si fournies
        if (preferred_activities) {
            // Supprimer les anciennes activités
            await pool.query(
                'DELETE FROM member_activities WHERE member_id = $1',
                [memberId]
            );

            // Ajouter les nouvelles activités
            if (preferred_activities.length > 0) {
                const activityValues = preferred_activities.map(activity => 
                    `(${memberId}, '${activity}')`
                ).join(',');
                
                await pool.query(
                    `INSERT INTO member_activities (member_id, activity) VALUES ${activityValues}`
                );
            }
        }

        // Récupérer le membre mis à jour avec ses activités
        const updatedMemberResult = await pool.query(
            `SELECT m.*, array_agg(DISTINCT a.activity) as preferred_activities 
             FROM family_members m 
             LEFT JOIN member_activities a ON m.id = a.member_id 
             WHERE m.id = $1 
             GROUP BY m.id`,
            [memberId]
        );

        res.json(updatedMemberResult.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du membre:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Ajouter un nouveau membre à la famille
const addFamilyMember = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { 
            first_name,
            last_name,
            role,
            birth_date,
            dietary_restrictions,
            preferred_activities 
        } = req.body;

        // Récupérer l'ID de la famille
        const familyResult = await pool.query(
            'SELECT id FROM families WHERE device_id = $1',
            [deviceId]
        );

        if (familyResult.rows.length === 0) {
            return res.status(404).json({ message: 'Famille non trouvée' });
        }

        const familyId = familyResult.rows[0].id;

        // Créer le nouveau membre
        const memberResult = await pool.query(
            `INSERT INTO family_members (
                family_id, 
                first_name, 
                last_name,
                role, 
                birth_date,
                dietary_restrictions
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [familyId, first_name, last_name, role, birth_date, dietary_restrictions]
        );

        const member = memberResult.rows[0];

        // Ajouter les activités préférées si fournies
        if (preferred_activities && preferred_activities.length > 0) {
            const activityValues = preferred_activities.map(activity => 
                `(${member.id}, '${activity}')`
            ).join(',');
            
            await pool.query(
                `INSERT INTO member_activities (member_id, activity) VALUES ${activityValues}`
            );
        }

        // Récupérer le membre créé avec ses activités
        const newMemberResult = await pool.query(
            `SELECT m.*, array_agg(DISTINCT a.activity) as preferred_activities 
             FROM family_members m 
             LEFT JOIN member_activities a ON m.id = a.member_id 
             WHERE m.id = $1 
             GROUP BY m.id`,
            [member.id]
        );

        res.status(201).json(newMemberResult.rows[0]);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du membre:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}; 