const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'evaneos_family',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function dropAllTables() {
  const client = await pool.connect();
  
  try {
    // Désactiver temporairement les contraintes de clé étrangère
    await client.query('SET session_replication_role = replica;');

    // Récupérer toutes les tables
    const result = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `);

    // Supprimer chaque table
    for (const row of result.rows) {
      const tableName = row.tablename;
      console.log(`🗑️ Suppression de la table: ${tableName}`);
      await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
    }

    // Réactiver les contraintes de clé étrangère
    await client.query('SET session_replication_role = DEFAULT;');

    console.log('✨ Toutes les tables ont été supprimées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des tables:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

dropAllTables(); 