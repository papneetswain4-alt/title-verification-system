const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function setupDatabase() {
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Initializing database schema...');
    try {
        await db.query(schema);
        console.log('Database schema localized/updated successfully.');
    } catch (err) {
        console.error('Error initializing database:', err.message);
        process.exit(1);
    }
}

if (require.main === module) {
    setupDatabase().then(() => process.exit(0));
}

module.exports = setupDatabase;
