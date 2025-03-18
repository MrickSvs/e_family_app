const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../config/db');

async function runMigration() {
  const client = await pool.connect();
  
  try {
    // Lire le fichier de migration
    const migrationFile = await fs.readFile(
      path.join(__dirname, '../migrations/001_create_tables.sql'),
      'utf8'
    );

    // Exécuter les migrations
    await client.query('BEGIN');
    await client.query(migrationFile);
    await client.query('COMMIT');

    console.log('✅ Migrations exécutées avec succès');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur lors de l\'exécution des migrations:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration(); 