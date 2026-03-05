const fs = require('fs');
const path = require('path');
const db = require('./db');

async function setupDatabase() {
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const seedPath = path.join(__dirname, '../../database/seed_titles.sql');
    const indexPath = path.join(__dirname, '../../database/indexes.sql');

    const schema = fs.readFileSync(schemaPath, 'utf8');
    const seed = fs.readFileSync(seedPath, 'utf8');
    const index = fs.readFileSync(indexPath, 'utf8');

    console.log('Initializing database schema, seeds, and indexes...');
    try {
        await db.query(schema);
        await db.query(seed);
        await db.query(index);
        console.log('Database initialized successfully with seeds and indexes.');
    } catch (err) {
        console.error('Error initializing database:', err.message);
        process.exit(1);
    }
}

if (require.main === module) {
    setupDatabase().then(() => process.exit(0));
}

module.exports = setupDatabase;
