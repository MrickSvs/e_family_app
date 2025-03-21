const express = require('express');
const router = express.Router();
const { getFamilyMemberProfile, updateFamilyMemberProfile } = require('../controllers/familyProfileController');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get detailed profile for a family member
router.get('/member/:memberId', getFamilyMemberProfile);

// Update detailed profile for a family member
router.put('/member/:memberId', updateFamilyMemberProfile);

module.exports = router; 