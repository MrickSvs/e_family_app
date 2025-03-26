const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { 
    getItineraries, 
    getItineraryById, 
    createItinerary, 
    updateItinerary, 
    deleteItinerary,
    createTestItinerary 
} = require('../controllers/itineraryController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Itinerary:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - duration
 *         - type
 *         - price
 *         - points
 *       properties:
 *         title:
 *           type: string
 *           description: Titre de l'itinéraire
 *         description:
 *           type: string
 *           description: Description détaillée de l'itinéraire
 *         duration:
 *           type: integer
 *           description: Durée en jours
 *         type:
 *           type: string
 *           description: Type d'itinéraire (ex: Nature & découverte, Culture & détente)
 *         price:
 *           type: number
 *           description: Prix de l'itinéraire
 *         image_url:
 *           type: string
 *           description: URL de l'image principale
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associés à l'itinéraire
 *         points:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               coordinate:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                     activity:
 *                       type: string
 *                     icon:
 *                       type: string
 */

// Schéma de validation pour la création/mise à jour d'un itinéraire
const itinerarySchema = Joi.object({
    title: Joi.string().required().min(2).max(255),
    description: Joi.string().required(),
    duration: Joi.number().integer().min(1).required(),
    type: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image_url: Joi.string().uri().allow(''),
    tags: Joi.array().items(Joi.string()),
    points: Joi.array().items(
        Joi.object({
            day: Joi.number().integer().min(1).required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            coordinate: Joi.object({
                latitude: Joi.number().required(),
                longitude: Joi.number().required()
            }).required(),
            steps: Joi.array().items(
                Joi.object({
                    time: Joi.string().required(),
                    activity: Joi.string().required(),
                    icon: Joi.string()
                })
            )
        })
    ).min(1).required()
});

// Middleware de validation
const validateItinerary = (req, res, next) => {
    const { error } = itinerarySchema.validate(req.body, { abortEarly: false });
    
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

/**
 * @swagger
 * /api/itineraries:
 *   get:
 *     summary: Récupère tous les itinéraires avec filtres optionnels
 *     tags: [Itineraries]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtre par type d'itinéraire
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filtre par tags (séparés par des virgules)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Prix minimum
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Prix maximum
 *       - in: query
 *         name: minDuration
 *         schema:
 *           type: integer
 *         description: Durée minimum en jours
 *       - in: query
 *         name: maxDuration
 *         schema:
 *           type: integer
 *         description: Durée maximum en jours
 *       - in: query
 *         name: family_id
 *         schema:
 *           type: integer
 *         description: ID de la famille pour filtrer les itinéraires selon ses préférences
 *     responses:
 *       200:
 *         description: Liste des itinéraires récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Itinerary'
 */
router.get('/', getItineraries);

/**
 * @swagger
 * /api/itineraries/{id}:
 *   get:
 *     summary: Récupère un itinéraire par son ID
 *     tags: [Itineraries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'itinéraire
 *     responses:
 *       200:
 *         description: Itinéraire récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Itinerary'
 *       404:
 *         description: Itinéraire non trouvé
 */
router.get('/:id', getItineraryById);

/**
 * @swagger
 * /api/itineraries:
 *   post:
 *     summary: Crée un nouvel itinéraire
 *     tags: [Itineraries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Itinerary'
 *     responses:
 *       201:
 *         description: Itinéraire créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Itinerary'
 */
router.post('/', validateItinerary, createItinerary);

/**
 * @swagger
 * /api/itineraries/{id}:
 *   put:
 *     summary: Met à jour un itinéraire existant
 *     tags: [Itineraries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'itinéraire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Itinerary'
 *     responses:
 *       200:
 *         description: Itinéraire mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Itinerary'
 *       404:
 *         description: Itinéraire non trouvé
 */
router.put('/:id', validateItinerary, updateItinerary);

/**
 * @swagger
 * /api/itineraries/{id}:
 *   delete:
 *     summary: Supprime un itinéraire
 *     tags: [Itineraries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'itinéraire
 *     responses:
 *       200:
 *         description: Itinéraire supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Itinéraire non trouvé
 */
router.delete('/:id', deleteItinerary);

/**
 * @swagger
 * /api/itineraries/test:
 *   post:
 *     summary: Crée un nouvel itinéraire de test (endpoint public)
 *     tags: [Itineraries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Itinerary'
 *     responses:
 *       201:
 *         description: Itinéraire créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Itinerary'
 */
router.post('/test', createTestItinerary);

module.exports = router; 