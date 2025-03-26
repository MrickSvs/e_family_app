const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Evaneos Family API',
      version: '1.0.0',
      description: 'API documentation for Evaneos Family application',
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Itinerary: {
          type: 'object',
          required: ['title', 'description', 'duration', 'type', 'price', 'points'],
          properties: {
            title: {
              type: 'string',
              description: 'Titre de l\'itinéraire'
            },
            description: {
              type: 'string',
              description: 'Description détaillée de l\'itinéraire'
            },
            duration: {
              type: 'integer',
              description: 'Durée en jours'
            },
            type: {
              type: 'string',
              description: 'Type d\'itinéraire (ex: Nature & découverte, Culture & détente)'
            },
            price: {
              type: 'number',
              description: 'Prix de l\'itinéraire'
            },
            image_url: {
              type: 'string',
              description: 'URL de l\'image principale'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Tags associés à l\'itinéraire'
            },
            points: {
              type: 'array',
              items: {
                type: 'object',
                required: ['day', 'title', 'description', 'coordinate'],
                properties: {
                  day: {
                    type: 'integer',
                    description: 'Numéro du jour dans l\'itinéraire'
                  },
                  title: {
                    type: 'string',
                    description: 'Titre du point'
                  },
                  description: {
                    type: 'string',
                    description: 'Description du point'
                  },
                  coordinate: {
                    type: 'object',
                    required: ['latitude', 'longitude'],
                    properties: {
                      latitude: {
                        type: 'number',
                        description: 'Latitude du point'
                      },
                      longitude: {
                        type: 'number',
                        description: 'Longitude du point'
                      }
                    }
                  },
                  steps: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['time', 'activity'],
                      properties: {
                        time: {
                          type: 'string',
                          description: 'Heure de l\'étape'
                        },
                        activity: {
                          type: 'string',
                          description: 'Description de l\'activité'
                        },
                        icon: {
                          type: 'string',
                          description: 'Icône associée à l\'activité'
                        }
                      }
                    }
                  }
                }
              },
              description: 'Points de l\'itinéraire'
            }
          }
        },
        ItineraryResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indique si la requête a réussi'
            },
            data: {
              $ref: '#/components/schemas/Itinerary'
            }
          }
        },
        ItineraryListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indique si la requête a réussi'
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Itinerary'
              }
            }
          }
        },
        TagCategory: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            tags: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer'
                  },
                  name: {
                    type: 'string'
                  },
                  description: {
                    type: 'string'
                  },
                  icon: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        TravelPreference: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            category: {
              type: 'string'
            },
            icon: {
              type: 'string'
            },
            values: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer'
                  },
                  value: {
                    type: 'string'
                  },
                  description: {
                    type: 'string'
                  },
                  icon: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        FamilyPreference: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            category: {
              type: 'string'
            },
            icon: {
              type: 'string'
            },
            value: {
              type: 'string'
            },
            value_description: {
              type: 'string'
            },
            value_icon: {
              type: 'string'
            }
          }
        },
        ItineraryTags: {
          type: 'object',
          properties: {
            standard_tags: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer'
                  },
                  name: {
                    type: 'string'
                  },
                  description: {
                    type: 'string'
                  },
                  icon: {
                    type: 'string'
                  },
                  category_name: {
                    type: 'string'
                  }
                }
              }
            },
            custom_tags: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer'
                  },
                  name: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        StandardTag: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            name: {
              type: 'string',
              enum: ['Culture', 'Nature', 'Plage', 'Sport', 'Découverte', 'Détente', 'Aventure', 'Non spécifié']
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ItineraryStandardTag: {
          type: 'object',
          properties: {
            itinerary_id: {
              type: 'integer'
            },
            tag_id: {
              type: 'integer'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Itinerary: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            title: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            duration: {
              type: 'integer'
            },
            type: {
              type: 'string',
              enum: ['Culture', 'Nature', 'Plage', 'Sport', 'Découverte', 'Détente', 'Aventure', 'Non spécifié']
            },
            price: {
              type: 'number'
            },
            image_url: {
              type: 'string'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            points: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            standard_tags: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/StandardTag'
              }
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Chemins vers les fichiers contenant les commentaires JSDoc
};

const specs = swaggerJsdoc(options);

module.exports = specs; 