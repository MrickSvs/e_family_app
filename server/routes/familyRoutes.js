const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');
const { auth } = require('../middleware/auth');
const pool = require('../config/db');
const Joi = require('joi');

/**
 * @swagger
 * components:
 *   schemas:
 *     Family:
 *       type: object
 *       properties:
 *         family_name:
 *           type: string
 *           description: Nom de la famille
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des intérêts de la famille
 *         travel_preferences:
 *           type: object
 *           properties:
 *             travel_type:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [Découverte, Aventure, Détente, Culture]
 *             budget:
 *               type: string
 *               enum: [Économique, Modéré, Confort, Luxe]
 *     FamilyMember:
 *       type: object
 *       required:
 *         - first_name
 *         - role
 *       properties:
 *         first_name:
 *           type: string
 *           description: Prénom du membre
 *         last_name:
 *           type: string
 *           description: Nom de famille du membre
 *         role:
 *           type: string
 *           enum: [Adulte, Enfant]
 *           description: Rôle dans la famille
 *         birth_date:
 *           type: string
 *           format: date
 *           description: Date de naissance (obligatoire pour les enfants)
 *         dietary_restrictions:
 *           type: string
 *           description: Restrictions alimentaires
 */

/**
 * @swagger
 * /api/families/by-device/{device_id}:
 *   get:
 *     summary: Récupérer les informations d'une famille par device_id
 *     tags: [Families]
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations de la famille récupérées avec succès
 *       404:
 *         description: Famille non trouvée
 *   post:
 *     summary: Créer un profil familial
 *     tags: [Families]
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Family'
 *     responses:
 *       201:
 *         description: Profil familial créé avec succès
 *       400:
 *         description: Données invalides
 *   put:
 *     summary: Mettre à jour un profil familial
 *     tags: [Families]
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Family'
 *     responses:
 *       200:
 *         description: Profil familial mis à jour avec succès
 *       404:
 *         description: Famille non trouvée
 */

/**
 * @swagger
 * /api/families/by-device/{device_id}/members:
 *   post:
 *     summary: Ajouter un membre à une famille
 *     tags: [Families]
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FamilyMember'
 *     responses:
 *       201:
 *         description: Membre ajouté avec succès
 *       404:
 *         description: Famille non trouvée
 */

// Schéma de validation pour la création/mise à jour d'une famille
const familySchema = Joi.object({
    family_name: Joi.string().min(2).max(255),
    interests: Joi.array().items(Joi.string()),
    travel_preferences: Joi.object({
        travel_type: Joi.array().items(Joi.string().valid('Découverte', 'Aventure', 'Détente', 'Culture')),
        budget: Joi.string().valid('Économique', 'Modéré', 'Confort', 'Luxe')
    })
});

// Schéma de validation pour l'ajout/mise à jour d'un membre
const memberSchema = Joi.object({
    first_name: Joi.string().required().min(2).max(255),
    last_name: Joi.string().min(2).max(255),
    role: Joi.string().required().valid('Adulte', 'Enfant'),
    birth_date: Joi.when('role', {
        is: 'Enfant',
        then: Joi.date().iso().required(),
        otherwise: Joi.date().iso().optional()
    }),
    dietary_restrictions: Joi.string()
});

// Middleware de validation pour la famille
const validateFamily = (req, res, next) => {
    const { error } = familySchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        
        return res.status(400).json({
            success: false,
            message: "Données invalides",
            errors
        });
    }
    
    next();
};

// Middleware de validation pour les membres
const validateMember = (req, res, next) => {
    const { error } = memberSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        
        return res.status(400).json({
            success: false,
            message: "Données invalides",
            errors
        });
    }
    
    next();
};

// Route publique pour récupérer les informations de la famille par device_id
router.get('/by-device/:device_id', async (req, res) => {
    try {
        // Récupérer les informations de base de la famille et ses préférences
        const familyResult = await pool.query(`
            SELECT f.*, fp.travel_type, fp.budget 
            FROM families f
            LEFT JOIN family_preferences fp ON f.id = fp.family_id
            WHERE f.device_id = $1
        `, [req.params.device_id]);

        if (familyResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Famille non trouvée" 
            });
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
                device_id: family.device_id,
                travel_type: family.travel_type || [],
                budget: family.budget || "Non spécifié"
            }
        });
    } catch (error) {
        console.error("❌ [getFamilyInfo] Erreur:", error);
        res.status(500).json({ 
            success: false, 
            message: "Erreur serveur" 
        });
    }
});

// Route pour créer un profil par device_id
router.post('/by-device/:device_id', validateFamily, async (req, res) => {
    try {
        const { device_id } = req.params;
        const { family_name, interests, travel_preferences } = req.body;

        // Vérifier si une famille existe déjà avec ce device_id
        const existingFamily = await pool.query(
            'SELECT id FROM families WHERE device_id = $1',
            [device_id]
        );

        if (existingFamily.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Une famille existe déjà pour cet appareil"
            });
        }

        // Créer la famille
        const familyResult = await pool.query(
            'INSERT INTO families (device_id, family_name) VALUES ($1, $2) RETURNING id',
            [device_id, family_name]
        );

        const familyId = familyResult.rows[0].id;

        // Ajouter les intérêts si fournis
        if (interests && interests.length > 0) {
            const interestValues = interests.map(interest => 
                `(${familyId}, '${interest}')`
            ).join(',');
            
            await pool.query(
                `INSERT INTO family_interests (family_id, interest) VALUES ${interestValues}`
            );
        }

        // Ajouter les préférences de voyage si fournies
        if (travel_preferences) {
            await pool.query(
                `INSERT INTO family_preferences (family_id, travel_type, budget)
                 VALUES ($1, $2, $3)`,
                [familyId, travel_preferences.travel_type, travel_preferences.budget]
            );
        }

        res.status(201).json({
            success: true,
            message: "Profil familial créé avec succès",
            data: {
                id: familyId,
                family_name,
                device_id,
                interests,
                travel_preferences
            }
        });
    } catch (error) {
        console.error("❌ [createFamilyProfile] Erreur:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création du profil"
        });
    }
});

// Route pour mettre à jour un profil par device_id
router.put('/by-device/:device_id', validateFamily, async (req, res) => {
    try {
        const { device_id } = req.params;
        const { family_name, interests, travel_preferences } = req.body;

        // Vérifier si la famille existe
        const familyResult = await pool.query(
            'SELECT id FROM families WHERE device_id = $1',
            [device_id]
        );

        if (familyResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Famille non trouvée"
            });
        }

        const familyId = familyResult.rows[0].id;

        // Mettre à jour le nom de la famille si fourni
        if (family_name) {
            await pool.query(
                'UPDATE families SET family_name = $1 WHERE id = $2',
                [family_name, familyId]
            );
        }

        // Mettre à jour les intérêts si fournis
        if (interests) {
            // Supprimer les anciens intérêts
            await pool.query(
                'DELETE FROM family_interests WHERE family_id = $1',
                [familyId]
            );

            // Ajouter les nouveaux intérêts
            if (interests.length > 0) {
                const interestValues = interests.map(interest => 
                    `(${familyId}, '${interest}')`
                ).join(',');
                
                await pool.query(
                    `INSERT INTO family_interests (family_id, interest) VALUES ${interestValues}`
                );
            }
        }

        // Mettre à jour les préférences de voyage si fournies
        if (travel_preferences) {
            await pool.query(
                `INSERT INTO family_preferences (family_id, travel_type, budget)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (family_id) DO UPDATE
                 SET travel_type = EXCLUDED.travel_type,
                     budget = EXCLUDED.budget`,
                [familyId, travel_preferences.travel_type, travel_preferences.budget]
            );
        }

        res.json({
            success: true,
            message: "Profil familial mis à jour avec succès"
        });
    } catch (error) {
        console.error("❌ [updateFamilyProfile] Erreur:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du profil"
        });
    }
});

// Route pour ajouter un membre à une famille par device_id
router.post('/by-device/:device_id/members', validateMember, async (req, res) => {
    try {
        const { device_id } = req.params;
        const { first_name, last_name, role, birth_date, dietary_restrictions } = req.body;

        // Vérifier si la famille existe
        const familyResult = await pool.query(
            'SELECT id FROM families WHERE device_id = $1',
            [device_id]
        );

        if (familyResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Famille non trouvée"
            });
        }

        const familyId = familyResult.rows[0].id;

        // Créer le nouveau membre
        const memberResult = await pool.query(
            `INSERT INTO family_members (
                family_id, first_name, last_name, role, birth_date, dietary_restrictions
            ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [familyId, first_name, last_name, role, birth_date, dietary_restrictions]
        );

        res.status(201).json({
            success: true,
            message: "Membre ajouté avec succès",
            data: memberResult.rows[0]
        });
    } catch (error) {
        console.error("❌ [addFamilyMember] Erreur:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'ajout du membre"
        });
    }
});

// Route pour mettre à jour un membre par device_id
router.put('/by-device/:device_id/members/:member_id', validateMember, async (req, res) => {
    try {
        const { device_id, member_id } = req.params;
        const { first_name, last_name, role, birth_date } = req.body;

        // Vérifier si la famille existe
        const familyResult = await pool.query(
            'SELECT id FROM families WHERE device_id = $1',
            [device_id]
        );

        if (familyResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Famille non trouvée"
            });
        }

        const familyId = familyResult.rows[0].id;

        // Mettre à jour le membre
        const memberResult = await pool.query(
            `UPDATE family_members 
             SET first_name = COALESCE($1, first_name),
                 last_name = COALESCE($2, last_name),
                 role = COALESCE($3, role),
                 birth_date = COALESCE($4, birth_date),
                 updated_at = NOW()
             WHERE id = $5 AND family_id = $6
             RETURNING *`,
            [first_name, last_name, role, birth_date, member_id, familyId]
        );

        if (memberResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Membre non trouvé"
            });
        }

        res.json({
            success: true,
            message: "Membre mis à jour avec succès",
            data: memberResult.rows[0]
        });
    } catch (error) {
        console.error("❌ [updateFamilyMember] Erreur:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du membre"
        });
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