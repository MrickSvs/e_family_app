const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');
const { auth } = require('../middleware/auth');
const pool = require('../config/db');

// Route publique pour récupérer les informations de la famille par device_id
router.get('/by-device/:device_id', async (req, res) => {
    try {
        // Récupérer les informations de base de la famille
        const familyResult = await pool.query(`
            SELECT f.* FROM families f
            WHERE f.device_id = $1
        `, [req.params.device_id]);

        if (familyResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Famille non trouvée" });
        }

        // Récupérer les membres de la famille
        const membersResult = await pool.query(`
            SELECT * FROM family_members
            WHERE family_id = $1
            ORDER BY role DESC, birth_date DESC
        `, [familyResult.rows[0].id]);

        const family = familyResult.rows[0];
        const members = membersResult.rows;

        // Calculer les statistiques de la famille
        const adults = members.filter(m => m.role === 'Adulte').length;
        const children = members.filter(m => m.role === 'Enfant');
        const childrenAges = children.map(child => {
            if (child.birth_date) {
                const birthDate = new Date(child.birth_date);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                // Ajuster l'âge si l'anniversaire n'est pas encore passé cette année
                if (today.getMonth() < birthDate.getMonth() || 
                    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
                    return age - 1;
                }
                return age;
            }
            return null;
        }).filter(age => age !== null);

        res.json({
            success: true,
            data: {
                familyName: family.family_name,
                adults,
                children: children.length,
                ages: childrenAges,
                members,
                device_id: family.device_id
            }
        });
    } catch (error) {
        console.error("❌ [getFamilyInfo] Erreur:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Routes protégées par authentification
router.use(auth);

// Créer une nouvelle famille
router.post('/', familyController.createFamily);

// Récupérer toutes les familles de l'utilisateur connecté
router.get('/', familyController.getFamiliesByUser);

// Récupérer une famille spécifique
router.get('/:id', familyController.getFamilyById);

// Mettre à jour une famille
router.put('/:id', familyController.updateFamily);

// Supprimer une famille
router.delete('/:id', familyController.deleteFamily);

module.exports = router; 