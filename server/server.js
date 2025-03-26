const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

const onboardingRoutes = require('./routes/onboarding');
const familyRoutes = require('./routes/familyRoutes');
const tripRoutes = require('./routes/trips');
const itineraryRoutes = require('./routes/itineraryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api', onboardingRoutes);
app.use('/api/families', familyRoutes);
app.use('/api', tripRoutes);
app.use('/api/itineraries', itineraryRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
