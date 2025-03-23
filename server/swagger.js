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
  },
  apis: ['./routes/*.js'], // Chemins vers les fichiers contenant les commentaires JSDoc
};

const specs = swaggerJsdoc(options);

module.exports = specs; 