const pool = require('../config/db');

/**
 * Récupère toutes les catégories de tags avec leurs tags standards
 */
const getTagCategories = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT tc.*, 
                   json_agg(json_build_object(
                       'id', st.id,
                       'name', st.name,
                       'description', st.description,
                       'icon', st.icon
                   )) as tags
            FROM tag_categories tc
            LEFT JOIN standard_tags st ON tc.id = st.category_id
            GROUP BY tc.id
            ORDER BY tc.name
        `);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des catégories de tags:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des catégories de tags"
        });
    }
};

/**
 * Récupère toutes les préférences de voyage avec leurs valeurs possibles
 */
const getTravelPreferences = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT tp.*, 
                   json_agg(json_build_object(
                       'id', pv.id,
                       'value', pv.value,
                       'description', pv.description,
                       'icon', pv.icon
                   )) as values
            FROM travel_preferences tp
            LEFT JOIN preference_values pv ON tp.id = pv.preference_id
            GROUP BY tp.id
            ORDER BY tp.category, tp.name
        `);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des préférences:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des préférences"
        });
    }
};

/**
 * Récupère les préférences d'une famille
 */
const getFamilyPreferences = async (req, res) => {
    try {
        const { family_id } = req.params;
        const result = await pool.query(`
            SELECT tp.name, tp.category, tp.icon,
                   pv.value, pv.description as value_description, pv.icon as value_icon
            FROM family_travel_preferences ftp
            JOIN travel_preferences tp ON ftp.preference_id = tp.id
            JOIN preference_values pv ON ftp.value_id = pv.id
            WHERE ftp.family_id = $1
            ORDER BY tp.category, tp.name
        `, [family_id]);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des préférences de la famille:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des préférences de la famille"
        });
    }
};

/**
 * Met à jour les préférences d'une famille
 */
const updateFamilyPreferences = async (req, res) => {
    try {
        const { family_id } = req.params;
        const { preferences } = req.body;

        // Supprimer les anciennes préférences
        await pool.query('DELETE FROM family_travel_preferences WHERE family_id = $1', [family_id]);

        // Insérer les nouvelles préférences
        for (const pref of preferences) {
            await pool.query(
                `INSERT INTO family_travel_preferences (family_id, preference_id, value_id)
                 VALUES ($1, $2, $3)`,
                [family_id, pref.preference_id, pref.value_id]
            );
        }

        res.json({
            success: true,
            message: "Préférences mises à jour avec succès"
        });
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour des préférences:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour des préférences"
        });
    }
};

/**
 * Ajoute des tags à un itinéraire
 */
const addItineraryTags = async (req, res) => {
    try {
        const { itinerary_id } = req.params;
        const { standard_tags, custom_tags } = req.body;

        // Supprimer les anciens tags
        await pool.query('DELETE FROM itinerary_standard_tags WHERE itinerary_id = $1', [itinerary_id]);
        await pool.query('DELETE FROM itinerary_custom_tags WHERE itinerary_id = $1', [itinerary_id]);

        // Ajouter les tags standards
        if (standard_tags && standard_tags.length > 0) {
            const values = standard_tags.map(tag_id => `(${itinerary_id}, ${tag_id})`).join(',');
            await pool.query(
                `INSERT INTO itinerary_standard_tags (itinerary_id, tag_id)
                 VALUES ${values}`
            );
        }

        // Ajouter les tags personnalisés
        if (custom_tags && custom_tags.length > 0) {
            for (const tag of custom_tags) {
                await pool.query(
                    `INSERT INTO itinerary_custom_tags (itinerary_id, name)
                     VALUES ($1, $2)`,
                    [itinerary_id, tag]
                );
            }
        }

        res.json({
            success: true,
            message: "Tags ajoutés avec succès"
        });
    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout des tags:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'ajout des tags"
        });
    }
};

/**
 * Récupère les tags d'un itinéraire
 */
const getItineraryTags = async (req, res) => {
    try {
        const { itinerary_id } = req.params;

        // Récupérer les tags standards
        const standardTags = await pool.query(`
            SELECT st.*, tc.name as category_name
            FROM itinerary_standard_tags ist
            JOIN standard_tags st ON ist.tag_id = st.id
            JOIN tag_categories tc ON st.category_id = tc.id
            WHERE ist.itinerary_id = $1
            ORDER BY tc.name, st.name
        `, [itinerary_id]);

        // Récupérer les tags personnalisés
        const customTags = await pool.query(
            'SELECT * FROM itinerary_custom_tags WHERE itinerary_id = $1',
            [itinerary_id]
        );

        res.json({
            success: true,
            data: {
                standard_tags: standardTags.rows,
                custom_tags: customTags.rows
            }
        });
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des tags:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des tags"
        });
    }
};

module.exports = {
    getTagCategories,
    getTravelPreferences,
    getFamilyPreferences,
    updateFamilyPreferences,
    addItineraryTags,
    getItineraryTags
}; 