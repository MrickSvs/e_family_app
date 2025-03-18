const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'evaneos_family',
    password: 'postgres',
    port: 5432,
});

// Vérifier la connexion
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Erreur de connexion à la base de données:', err.stack);
    } else {
        console.log('✅ Connecté à PostgreSQL');
        release();
    }
});

// En cas d'erreur sur le pool
pool.on('error', (err) => {
    console.error('❌ Erreur inattendue sur le client PostgreSQL:', err);
});

module.exports = pool;
