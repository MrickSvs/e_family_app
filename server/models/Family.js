const { pool } = require('../db');

const Family = {
  // Créer une nouvelle famille
  async create(familyData) {
    const { family_name, device_id } = familyData;
    const result = await pool.query(
      'INSERT INTO families (family_name, device_id) VALUES ($1, $2) RETURNING *',
      [family_name, device_id]
    );
    return result.rows[0];
  },

  // Récupérer une famille par device_id
  async findByDeviceId(deviceId) {
    const result = await pool.query(
      'SELECT * FROM families WHERE device_id = $1',
      [deviceId]
    );
    return result.rows[0];
  },

  // Mettre à jour une famille
  async update(deviceId, updateData) {
    const { family_name, family_photo_url } = updateData;
    const result = await pool.query(
      `UPDATE families 
       SET family_name = COALESCE($1, family_name),
           family_photo_url = COALESCE($2, family_photo_url),
           updated_at = NOW()
       WHERE device_id = $3 
       RETURNING *`,
      [family_name, family_photo_url, deviceId]
    );
    return result.rows[0];
  }
};

module.exports = Family; 