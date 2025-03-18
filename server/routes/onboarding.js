const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/onboarding', async (req, res) => {
    console.log("➡️ [onboarding] Requête reçue :", req.body);

    try {
        const { device_id, family_name, members, travel_preferences } = req.body;
        
        // 1. Insérer la famille (sans les préférences de voyage)
        const familyResult = await pool.query(`
            INSERT INTO families (device_id, family_name)
            VALUES ($1, $2) RETURNING id
        `, [
            device_id,
            family_name
        ]);

        const familyId = familyResult.rows[0].id;

        // 2. Insérer les membres
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
            familyId,
            travel_preferences // On renvoie les préférences pour les sauvegarder côté client
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
