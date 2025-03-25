const Family = require('../models/Family');
const pool = require('../config/db');

// Créer une nouvelle famille
const createFamily = async (req, res) => {
  try {
    const family = new Family({
      user_id: req.user._id, // Supposant que l'authentification est en place
      family_name: req.body.family_name,
      members: req.body.members,
      travel_preferences: req.body.travel_preferences
    });

    const savedFamily = await family.save();
    res.status(201).json(savedFamily);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la création de la famille",
      error: error.message
    });
  }
};

// Récupérer une famille par ID
const getFamilyById = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) {
      return res.status(404).json({ message: "Famille non trouvée" });
    }
    
    // Vérifier que l'utilisateur a le droit d'accéder à cette famille
    if (family.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    res.json(family);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la famille",
      error: error.message
    });
  }
};

// Mettre à jour une famille
const updateFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) {
      return res.status(404).json({ message: "Famille non trouvée" });
    }

    // Vérifier que l'utilisateur a le droit de modifier cette famille
    if (family.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    // Mettre à jour les champs
    if (req.body.family_name) family.family_name = req.body.family_name;
    if (req.body.members) family.members = req.body.members;
    if (req.body.travel_preferences) family.travel_preferences = req.body.travel_preferences;

    const updatedFamily = await family.save();
    res.json(updatedFamily);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la mise à jour de la famille",
      error: error.message
    });
  }
};

// Supprimer une famille
const deleteFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) {
      return res.status(404).json({ message: "Famille non trouvée" });
    }

    // Vérifier que l'utilisateur a le droit de supprimer cette famille
    if (family.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    await family.remove();
    res.json({ message: "Famille supprimée avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la famille",
      error: error.message
    });
  }
};

// Récupérer toutes les familles d'un utilisateur
const getFamiliesByUser = async (req, res) => {
  try {
    const families = await Family.find({ user_id: req.user._id });
    res.json(families);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des familles",
      error: error.message
    });
  }
};

const updateFamilyMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { first_name, last_name, role, birth_date } = req.body;
        const deviceId = req.headers['x-device-id'];

        // Vérifier que la famille existe
        const familyResult = await pool.query(
            'SELECT id FROM families WHERE device_id = $1',
            [deviceId]
        );

        if (familyResult.rows.length === 0) {
            return res.status(404).json({ message: 'Famille non trouvée' });
        }

        const familyId = familyResult.rows[0].id;

        // Vérifier que le membre appartient à la famille
        const memberCheckResult = await pool.query(
            'SELECT id FROM family_members WHERE id = $1 AND family_id = $2',
            [memberId, familyId]
        );

        if (memberCheckResult.rows.length === 0) {
            return res.status(404).json({ message: 'Membre non trouvé dans cette famille' });
        }

        // Mettre à jour le membre
        const updateResult = await pool.query(
            `UPDATE family_members 
             SET first_name = COALESCE($1, first_name),
                 last_name = COALESCE($2, last_name),
                 role = COALESCE($3, role),
                 birth_date = COALESCE($4, birth_date),
                 updated_at = NOW()
             WHERE id = $5 AND family_id = $6
             RETURNING id, first_name, last_name, role, birth_date`,
            [first_name, last_name, role, birth_date, memberId, familyId]
        );

        res.json({
            message: 'Membre mis à jour avec succès',
            data: updateResult.rows[0]
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du membre:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    createFamily,
    getFamilyById,
    updateFamily,
    deleteFamily,
    getFamiliesByUser,
    updateFamilyMember
}; 