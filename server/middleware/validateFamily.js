const Joi = require('joi');

const familySchema = Joi.object({
  family_name: Joi.string().required().min(2).max(255),
  members: Joi.array().items(
    Joi.object({
      first_name: Joi.string().required().min(2).max(255),
      last_name: Joi.string().required().min(2).max(255),
      role: Joi.string().required().valid('Adulte', 'Enfant'),
      birth_date: Joi.when('role', {
        is: 'Enfant',
        then: Joi.date().iso().required(),
        otherwise: Joi.date().iso().optional()
      })
    })
  ).min(1).required(),
  travel_preferences: Joi.object({
    travel_type: Joi.string().required().valid('Découverte', 'Aventure', 'Détente', 'Culture'),
    budget: Joi.string().required().valid('Économique', 'Modéré', 'Confort', 'Luxe')
  }).required()
});

const validateFamily = (req, res, next) => {
  const { error } = familySchema.validate(req.body, { abortEarly: false });
  
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
      travel_type: Joi.string().valid('Découverte', 'Aventure', 'Détente', 'Culture'),
      budget: Joi.string().valid('Économique', 'Modéré', 'Confort', 'Luxe')
    })
  }).min(1); // Au moins un champ doit être fourni

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