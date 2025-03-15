const pool = require("../config/db");

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      num_adults INTEGER NOT NULL,
      num_children INTEGER NOT NULL,
      children_ages TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log("✅ Table 'users' prête");
};

createUserTable().catch(console.error);
