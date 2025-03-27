const pool = require('../config/db');

/**
 * Récupère tous les itinéraires avec filtres optionnels
 */
const getItineraries = async (req, res) => {
    try {
        const { tags, minPrice, maxPrice, minDuration, maxDuration, device_id } = req.query;
        
        console.log('📝 Paramètres de la requête:', {
            tags,
            minPrice,
            maxPrice,
            minDuration,
            maxDuration,
            device_id
        });
        
        // Récupérer l'ID de la famille à partir du device_id
        const familyResult = await pool.query(
            'SELECT id FROM families WHERE device_id = $1',
            [device_id]
        );

        console.log('👨‍👩‍👧‍👦 Résultat de la recherche de famille:', familyResult.rows[0]);

        if (familyResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Famille non trouvée"
            });
        }

        const family_id = familyResult.rows[0].id;

        // Récupérer les préférences de voyage de la famille
        const preferencesResult = await pool.query(
            'SELECT travel_type FROM family_preferences WHERE family_id = $1',
            [family_id]
        );

        console.log('🎯 Préférences de voyage de la famille:', preferencesResult.rows[0]);

        const familyTravelTypes = preferencesResult.rows[0]?.travel_type || [];

        let query = `
            SELECT i.*
            FROM itineraries i
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;

        // Filtre par tags
        if (tags) {
            const tagArray = tags.split(',');
            query += ` AND i.tags && $${paramCount}`;
            params.push(tagArray);
            paramCount++;
        }

        // Filtre par prix
        if (minPrice) {
            query += ` AND i.price >= $${paramCount}`;
            params.push(minPrice);
            paramCount++;
        }
        if (maxPrice) {
            query += ` AND i.price <= $${paramCount}`;
            params.push(maxPrice);
            paramCount++;
        }

        // Filtre par durée
        if (minDuration) {
            query += ` AND i.duration >= $${paramCount}`;
            params.push(minDuration);
            paramCount++;
        }
        if (maxDuration) {
            query += ` AND i.duration <= $${paramCount}`;
            params.push(maxDuration);
            paramCount++;
        }

        // Filtre par préférences de la famille
        if (familyTravelTypes.length > 0) {
            query += ` AND i.tags && $${paramCount}`;
            params.push(familyTravelTypes);
            paramCount++;
        }

        // Tri par date de création
        query += ' ORDER BY i.created_at DESC';

        console.log('🔍 Requête SQL finale:', query);
        console.log('📊 Paramètres de la requête:', params);

        const result = await pool.query(query, params);
        
        console.log('✅ Nombre d\'itinéraires trouvés:', result.rows.length);
        console.log('📋 Premier itinéraire:', result.rows[0]);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des itinéraires:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des itinéraires"
        });
    }
};

/**
 * Récupère un itinéraire par son ID
 */
const getItineraryById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM itineraries WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Itinéraire non trouvé"
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Erreur lors de la récupération de l\'itinéraire:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de l'itinéraire"
        });
    }
};

/**
 * Crée un nouvel itinéraire
 */
const createItinerary = async (req, res) => {
    try {
        const { title, description, duration, price, image_url, tags, points } = req.body;

        const result = await pool.query(
            `INSERT INTO itineraries (title, description, duration, price, image_url, tags, points)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [title, description, duration, price, image_url, tags, points]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Erreur lors de la création de l\'itinéraire:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création de l'itinéraire"
        });
    }
};

/**
 * Met à jour un itinéraire existant
 */
const updateItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, duration, price, image_url, tags, points } = req.body;

        const result = await pool.query(
            `UPDATE itineraries 
             SET title = $1, description = $2, duration = $3, 
                 price = $4, image_url = $5, tags = $6, points = $7
             WHERE id = $8
             RETURNING *`,
            [title, description, duration, price, image_url, tags, points, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Itinéraire non trouvé"
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour de l\'itinéraire:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour de l'itinéraire"
        });
    }
};

/**
 * Supprime un itinéraire
 */
const deleteItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM itineraries WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Itinéraire non trouvé"
            });
        }

        res.json({
            success: true,
            message: "Itinéraire supprimé avec succès"
        });
    } catch (error) {
        console.error('❌ Erreur lors de la suppression de l\'itinéraire:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de l'itinéraire"
        });
    }
};

/**
 * Crée un nouvel itinéraire de test (endpoint public)
 */
const createTestItinerary = async (req, res) => {
    try {
        const { title, description, duration, price, image_url, tags, points } = req.body;

        console.log('📝 Données reçues pour la création d\'un itinéraire de test:', {
            title,
            description,
            duration,
            price,
            image_url,
            tags,
            points
        });

        const result = await pool.query(
            `INSERT INTO itineraries (title, description, duration, price, image_url, tags, points)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [title, description, duration, price, image_url, tags, points]
        );

        console.log('✅ Itinéraire de test créé avec succès:', result.rows[0]);

        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Erreur lors de la création de l\'itinéraire de test:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création de l'itinéraire de test"
        });
    }
};

module.exports = {
    getItineraries,
    getItineraryById,
    createItinerary,
    updateItinerary,
    deleteItinerary,
    createTestItinerary
}; 