const asyncHandler = require('express-async-handler');

const auth = asyncHandler(async (req, res, next) => {
  const deviceId = req.headers['x-device-id'];

  if (!deviceId) {
    res.status(401);
    throw new Error('Accès non autorisé - Device ID manquant');
  }

  req.deviceId = deviceId;
  next();
});

module.exports = { auth }; 