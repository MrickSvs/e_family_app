const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const Joi = require('joi');

/**
 * @swagger
 * components:
 *   schemas:
 *     OnboardingRequest:
 *       type: object
 *       required:
 *         - device_id
 *         - family_name
 *         - members
 *         - travel_preferences
 *       properties:
 *         device_id:
 *           type: string
 *           description: Identifiant unique de l'appareil
 *         family_name:
 *           type: string
 *           description: Nom de la famille
 *         members:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - role
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Adulte, Enfant]
 *               birth_date:
 *                 type: string
 *                 format: date
 *         travel_preferences:
 *           type: object
 *           required:
 *             - travel_type
 *             - budget
 *           properties:
 *             travel_type:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [Découverte, Aventure, Détente, Culture, Nature, Plage, Sport, Non spécifié]
 *             budget:
 *               type: string
 *               enum: [Économique, Modéré, Confort, Luxe, Non spécifié]
 */

/**
 * @swagger
 * /api/onboarding:
 *   post:
 *     summary: Créer une nouvelle famille
 *     tags: [Onboarding]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OnboardingRequest'
 *     responses:
 *       201:
 *         description: Famille créée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */

// Schéma de validation pour l'onboarding
const onboardingSchema = Joi.object({
    device_id: Joi.string().required(),
    family_name: Joi.string().required().min(2).max(255),
    members: Joi.array().items(
        Joi.object({
            first_name: Joi.string().required().min(2).max(255),
            last_name: Joi.string().required().min(2).max(255),
            role: Joi.string().required().valid('Adulte', 'Enfant'),
            birth_date: Joi.when('role', {
                is: 'Enfant',
                then: Joi.date().iso().allow(null),
                otherwise: Joi.date().iso().optional()
            })
        })
    ).min(1).required(),
    travel_preferences: Joi.object({
        travel_type: Joi.array().items(
            Joi.string().valid('Découverte', 'Aventure', 'Détente', 'Culture', 'Nature', 'Plage', 'Sport', 'Non spécifié').required()
        ).single().required(),
        budget: Joi.string().required().valid('Économique', 'Modéré', 'Confort', 'Luxe', 'Non spécifié')
    }).required()
});

// Middleware de validation
const validateOnboarding = (req, res, next) => {
    const { error } = onboardingSchema.validate(req.body, { abortEarly: false });
    
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

router.post('/onboarding', validateOnboarding, async (req, res) => {
    console.log("➡️ [onboarding] Requête reçue :", {
        device_id: req.body.device_id,
        family_name: req.body.family_name,
        members_count: req.body.members?.length,
        travel_preferences: req.body.travel_preferences
    });

    try {
        const { device_id, family_name, members, travel_preferences } = req.body;
        
        // 1. Insérer la famille
        console.log("📝 [onboarding] Création de la famille...");
        const familyResult = await pool.query(`
            INSERT INTO families (device_id, family_name)
            VALUES ($1, $2) RETURNING id
        `, [
            device_id,
            family_name
        ]);

        const familyId = familyResult.rows[0].id;
        console.log("✅ [onboarding] Famille créée avec l'ID:", familyId);

        // 2. Insérer les préférences
        console.log("📝 [onboarding] Ajout des préférences de voyage...");
        const travelTypes = Array.isArray(travel_preferences.travel_type) 
            ? travel_preferences.travel_type 
            : [travel_preferences.travel_type];
        console.log("ℹ️ [onboarding] Types de voyage:", travelTypes);
        console.log("ℹ️ [onboarding] Budget:", travel_preferences.budget);
        
        await pool.query(`
            INSERT INTO family_preferences (family_id, travel_type, budget)
            VALUES ($1, $2, $3)
        `, [
            familyId,
            travelTypes,
            travel_preferences.budget === 'Non spécifié' ? null : travel_preferences.budget
        ]);
        console.log("✅ [onboarding] Préférences de voyage enregistrées");

        // 3. Insérer les membres
        console.log("📝 [onboarding] Ajout des membres de la famille...");
        for (const member of members) {
            console.log("ℹ️ [onboarding] Ajout du membre:", {
                role: member.role,
                has_birth_date: !!member.birth_date
            });
            
            await pool.query(`
                INSERT INTO family_members (family_id, first_name, last_name, role, birth_date)
                VALUES ($1, $2, $3, $4, $5)
            `, [
                familyId,
                member.first_name,
                member.last_name,
                member.role,
                member.birth_date
            ]);
        }
        console.log("✅ [onboarding] Tous les membres ont été ajoutés");

        res.json({
            success: true,
            message: "Données d'onboarding enregistrées avec succès",
            data: {
                familyId,
                device_id,
                family_name,
                travel_preferences
            }
        });
    } catch (error) {
        console.error("❌ [onboarding] Erreur:", error);
        console.error("❌ [onboarding] Stack:", error.stack);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'enregistrement des données d'onboarding"
        });
    }
});

module.exports = router;
