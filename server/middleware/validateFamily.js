const Joi = require('joi');

const familySchema = Joi.object({
  family_name: Joi.string().min(2).max(255),
  interests: Joi.array().items(Joi.string()),
  travel_preferences: Joi.object({
    travel_type: Joi.array().items(
      Joi.string().valid(
        'Culture',
        'Nature',
        'Plage',
        'Sport',
        'Découverte',
        'Détente',
        'Aventure',
        'Non spécifié'
      )
    ).single(),
    budget: Joi.string().valid('Économique', 'Modéré', 'Luxe'),
    accommodation_type: Joi.string().valid('Hôtel', 'Appartement', 'Surprise'),
    travel_pace: Joi.string().valid('Relaxé', 'Equilibré', 'Actif')
  })
});

const validateFamily = (req, res, next) => {
  console.log('🔍 [validateFamily] Validation des données:', req.body);
  const { error } = familySchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    console.log('❌ [validateFamily] Erreurs de validation:', error.details);
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
  
  console.log('✅ [validateFamily] Validation réussie');
  next();
};

const validateFamilyUpdate = (req, res, next) => {
  const updateSchema = Joi.object({
    family_name: Joi.string().min(2).max(255),
    members: Joi.array().items(
      Joi.object({
        first_name: Joi.string().min(2).max(255),
        last_name: Joi.string().min(2).max(255),
        role: Joi.string().valid('Adulte', 'Enfant'),
        birth_date: Joi.when('role', {
          is: 'Enfant',
          then: Joi.date().iso().required(),
          otherwise: Joi.date().iso().optional()
        })
      })
    ).min(1),
    travel_preferences: Joi.object({
      travel_type: Joi.array().items(
        Joi.string().valid(
          'Culture',
          'Nature',
          'Plage',
          'Sport',
          'Découverte',
          'Détente',
          'Aventure',
          'Non spécifié'
        )
      ),
      budget: Joi.string().valid('Économique', 'Modéré', 'Luxe'),
      accommodation_type: Joi.string().valid('Hôtel', 'Appartement', 'Surprise'),
      travel_pace: Joi.string().valid('Relaxé', 'Equilibré', 'Actif')
    })
  }).min(1);

  const { error } = updateSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      message: "Données invalides",
      errors
    });
  }
  
  next();
};

module.exports = {
  validateFamily,
  validateFamilyUpdate
}; 