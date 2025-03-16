const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/onboarding', async (req, res) => {
    console.log("➡️ [onboarding] Requête reçue :", req.body);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log("➡️ [onboarding] Transaction démarrée.");

        const { user_id, family_name, members, travel_preferences } = req.body;
        
        // 1. Insérer la famille
        const familyResult = await client.query(`
          INSERT INTO families (user_id, family_name, travel_type, budget)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [
          user_id,
          family_name,
          travel_preferences?.travel_type || null,
          travel_preferences?.budget || null
        ]);
        const familyId = familyResult.rows[0].id;
        console.log("➡️ [onboarding] Famille insérée avec ID =", familyId);

        // 2. Insérer les membres
        for (const member of members) {
            console.log("➡️ [onboarding] Insertion du membre :", member);
            await client.query(`
              INSERT INTO family_members (family_id, first_name, last_name, birth_date, role)
              VALUES ($1, $2, $3, $4, $5)
            `, [
              familyId,
              member.first_name.trim(),
              member.last_name.trim(),
              member.birth_date,
              member.role.trim(),
            ]);
        }

        // 3. Commit
        await client.query('COMMIT');
        console.log("✅ [onboarding] Transaction validée. Données insérées !");

        return res.json({ success: true, message: "Onboarding enregistré avec succès" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("❌ [onboarding] Erreur :", error);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
    } finally {
        client.release();
        console.log("➡️ [onboarding] Connexion libérée.");
    }
});



module.exports = router;
