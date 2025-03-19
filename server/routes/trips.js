const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const Joi = require('joi');

// Schéma de validation pour la création d'un voyage
const tripSchema = Joi.object({
    itinerary_id: Joi.number().required(),
    estimated_date: Joi.date().iso().required(),
    notes: Joi.string().allow('').optional(),
    participants: Joi.array().items(Joi.number()).min(1).required()
});

// Middleware de validation
const validateTrip = (req, res, next) => {
    const { error } = tripSchema.validate(req.body, { abortEarly: false });
    
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

// Créer un nouveau voyage
router.post('/trips', validateTrip, async (req, res) => {
    try {
        const deviceId = req.headers['device-id'];
        console.log('Device ID reçu:', deviceId);
        
        if (!deviceId) {
            return res.status(400).json({
                success: false,
                message: "Device ID manquant"
            });
        }

        // Récupérer le family_id à partir du device_id
        console.log('Recherche de la famille avec le device_id:', deviceId);
        const familyResult = await pool.query(
            'SELECT id FROM families WHERE device_id = $1',
            [deviceId]
        );
        console.log('Résultat de la recherche:', familyResult.rows);

        if (familyResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Famille non trouvée"
            });
        }

        const family_id = familyResult.rows[0].id;
        const { itinerary_id, estimated_date, notes, participants } = req.body;

        // 1. Créer le voyage
        const tripResult = await pool.query(`
            INSERT INTO trips (family_id, itinerary_id, estimated_date, notes, status)
            VALUES ($1, $2, $3, $4, 'planifié')
            RETURNING id
        `, [family_id, itinerary_id, estimated_date, notes]);

        const trip_id = tripResult.rows[0].id;

        // 2. Ajouter les participants
        for (const member_id of participants) {
            await pool.query(`
                INSERT INTO trip_participants (trip_id, member_id)
                VALUES ($1, $2)
            `, [trip_id, member_id]);
        }

        res.json({
            success: true,
            message: "Voyage créé avec succès",
            data: { trip_id }
        });
    } catch (error) {
        console.error("❌ Erreur lors de la création du voyage:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création du voyage"
        });
    }
});

// Récupérer les voyages d'une famille
router.get('/trips', async (req, res) => {
    try {
        const deviceId = req.headers['device-id'];
        if (!deviceId) {
            return res.status(400).json({
                success: false,
                message: "Device ID manquant"
            });
        }

        // Récupérer le family_id à partir du device_id
        const familyResult = await pool.query(
            'SELECT id FROM families WHERE device_id = $1',
            [deviceId]
        );

        if (familyResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Famille non trouvée"
            });
        }

        const family_id = familyResult.rows[0].id;
        
        const trips = await pool.query(`
            SELECT t.*, i.title as itinerary_title, i.description as itinerary_description
            FROM trips t
            JOIN itineraries i ON t.itinerary_id = i.id
            WHERE t.family_id = $1
            ORDER BY t.estimated_date DESC
        `, [family_id]);

        res.json({
            success: true,
            data: trips.rows
        });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des voyages:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des voyages"
        });
    }
});

module.exports = router; 