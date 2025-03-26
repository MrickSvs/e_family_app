const express = require('express');
const router = express.Router();
const tagAndPreferenceController = require('../controllers/tagAndPreferenceController');
const { authenticateToken } = require('../middleware/auth');

// Routes pour les catégories de tags
router.get('/tag-categories', authenticateToken, tagAndPreferenceController.getTagCategories);

// Routes pour les préférences de voyage
router.get('/travel-preferences', authenticateToken, tagAndPreferenceController.getTravelPreferences);

// Routes pour les préférences d'une famille
router.get('/families/:family_id/preferences', authenticateToken, tagAndPreferenceController.getFamilyPreferences);
router.put('/families/:family_id/preferences', authenticateToken, tagAndPreferenceController.updateFamilyPreferences);

// Routes pour les tags d'un itinéraire
router.get('/itineraries/:itinerary_id/tags', authenticateToken, tagAndPreferenceController.getItineraryTags);
router.put('/itineraries/:itinerary_id/tags', authenticateToken, tagAndPreferenceController.addItineraryTags);

module.exports = router; 