const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("✅ Connecté à la base de données"))
  .catch(err => console.error("❌ Erreur de connexion à la DB", err));

module.exports = pool;
