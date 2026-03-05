const { Pool } = require('pg');
require('dotenv').config();

// Default config falls back to standard postgres local config or env vars
// Render provides DATABASE_URL which is a full connection string
const connectionString = process.env.DATABASE_URL;

const pool = connectionString
    ? new Pool({ connectionString, ssl: { rejectUnauthorized: false } }) // SSL required for Render/external DBs
    : new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'prgi_titles',
        password: process.env.DB_PASSWORD || 'postgres',
        port: process.env.DB_PORT || 5432,
    });

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect()
};
