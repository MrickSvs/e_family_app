const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const familyRoutes = require('./familyRoutes');
const itineraryRoutes = require('./itineraryRoutes');
const tagAndPreferenceRoutes = require('./tagAndPreferenceRoutes');

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes des familles
router.use('/families', familyRoutes);

// Routes des itinéraires
router.use('/itineraries', itineraryRoutes);

// Routes des tags et préférences
router.use('/tags-and-preferences', tagAndPreferenceRoutes);

module.exports = router; 