const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const Joi = require('joi');

/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - itinerary_id
 *         - estimated_date
 *         - participants
 *         - duration
 *       properties:
 *         itinerary_id:
 *           type: integer
 *           description: ID de l'itinéraire choisi
 *         estimated_date:
 *           type: string
 *           format: date
 *           description: Date estimée du voyage
 *         notes:
 *           type: string
 *           description: Notes additionnelles sur le voyage
 *         participants:
 *           type: array
 *           items:
 *             type: integer
 *           description: Liste des IDs des membres participants
 *         duration:
 *           type: integer
 *           minimum: 1
 *           description: Durée du voyage en jours
 */

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Créer un nouveau voyage
 *     tags: [Trips]
 *     parameters:
 *       - in: header
 *         name: device-id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       201:
 *         description: Voyage créé avec succès
 *       400:
 *         description: Données invalides ou Device ID manquant
 *       404:
 *         description: Famille non trouvée
 *   get:
 *     summary: Récupérer les voyages d'une famille
 *     tags: [Trips]
 *     parameters:
 *       - in: header
 *         name: device-id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des voyages récupérée avec succès
 *       400:
 *         description: Device ID manquant
 *       404:
 *         description: Famille non trouvée
 */

// Schéma de validation pour la création d'un voyage
const tripSchema = Joi.object({
    itinerary_id: Joi.number().required(),
    estimated_date: Joi.date().iso().required(),
    notes: Joi.string().allow('').optional(),
    participants: Joi.array().items(Joi.number()).min(1).required(),
    duration: Joi.number().integer().min(1).required()
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
        console.log('🔍 Device ID reçu:', deviceId);
        console.log('📦 Données reçues:', req.body);
        
        if (!deviceId) {
            console.log('❌ Device ID manquant');
            return res.status(400).json({
                success: false,
                message: "Device ID manquant"
            });
        }

        // Récupérer le family_id à partir du device_id
        console.log('🔍 Recherche de la famille avec le device_id:', deviceId);
        const familyResult = await pool.query(
            'SELECT id FROM families WHERE device_id = $1',
            [deviceId]
        );
        console.log('✅ Résultat de la recherche:', familyResult.rows);

        if (familyResult.rows.length === 0) {
            console.log('❌ Famille non trouvée');
            return res.status(404).json({
                success: false,
                message: "Famille non trouvée"
            });
        }

        const family_id = familyResult.rows[0].id;
        const { itinerary_id, estimated_date, notes, participants, duration } = req.body;

        console.log('📝 Création du voyage avec les données suivantes:', {
            family_id,
            itinerary_id,
            estimated_date,
            notes,
            duration,
            participants
        });

        // 1. Créer le voyage
        const tripResult = await pool.query(`
            INSERT INTO trips (family_id, itinerary_id, estimated_date, notes, status, duration)
            VALUES ($1, $2, $3, $4, 'planifié', $5)
            RETURNING id
        `, [family_id, itinerary_id, estimated_date, notes, duration]);

        const trip_id = tripResult.rows[0].id;
        console.log('✅ Voyage créé avec l\'ID:', trip_id);

        // 2. Ajouter les participants
        console.log('👥 Ajout des participants:', participants);
        for (const member_id of participants) {
            try {
                await pool.query(`
                    INSERT INTO trip_participants (trip_id, member_id)
                    VALUES ($1, $2)
                `, [trip_id, member_id]);
                console.log('✅ Participant ajouté:', member_id);
            } catch (error) {
                console.error('❌ Erreur lors de l\'ajout du participant:', member_id, error);
                throw error;
            }
        }

        console.log('✅ Voyage créé avec succès');
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