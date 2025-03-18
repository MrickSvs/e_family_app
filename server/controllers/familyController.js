const Family = require('../models/Family');

// Créer une nouvelle famille
exports.createFamily = async (req, res) => {
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
exports.getFamilyById = async (req, res) => {
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
exports.updateFamily = async (req, res) => {
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
exports.deleteFamily = async (req, res) => {
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
exports.getFamiliesByUser = async (req, res) => {
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