const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const Joi = require('joi');

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
        travel_type: Joi.alternatives().try(
            Joi.string().valid('Découverte', 'Aventure', 'Détente', 'Culture', 'Non spécifié'),
            Joi.array().items(Joi.string().valid('Découverte', 'Aventure', 'Détente', 'Culture', 'Non spécifié'))
        ).required(),
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
    console.log("➡️ [onboarding] Requête reçue :", req.body);

    try {
        const { device_id, family_name, members, travel_preferences } = req.body;
        
        // 1. Insérer la famille
        const familyResult = await pool.query(`
            INSERT INTO families (device_id, family_name)
            VALUES ($1, $2) RETURNING id
        `, [
            device_id,
            family_name
        ]);

        const familyId = familyResult.rows[0].id;

        // 2. Insérer les préférences
        await pool.query(`
            INSERT INTO family_preferences (family_id, travel_type, budget)
            VALUES ($1, $2, $3)
        `, [
            familyId,
            Array.isArray(travel_preferences.travel_type) 
                ? travel_preferences.travel_type 
                : [travel_preferences.travel_type],
            travel_preferences.budget === 'Non spécifié' ? null : travel_preferences.budget
        ]);

        // 3. Insérer les membres
        for (const member of members) {
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
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'enregistrement des données d'onboarding"
        });
    }
});

module.exports = router;
