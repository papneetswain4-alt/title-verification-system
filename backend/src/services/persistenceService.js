const fs = require('fs');
const path = require('path');

const STORAGE_PATH = path.join(__dirname, '../../../datasets/application_queue.json');

class PersistenceService {
    constructor() {
        this._initStorage();
    }

    _initStorage() {
        if (!fs.existsSync(STORAGE_PATH)) {
            // Ensure directory exists
            const dir = path.dirname(STORAGE_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(STORAGE_PATH, JSON.stringify([]));
        }
    }

    /**
     * Save a new application to the local JSON storage
     */
    async trackApplication(data) {
        try {
            const applications = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf8'));
            const newApp = {
                id: Date.now(),
                ...data,
                timestamp: new Date().toISOString()
            };
            applications.push(newApp);
            fs.writeFileSync(STORAGE_PATH, JSON.stringify(applications, null, 2));
            return newApp;
        } catch (error) {
            console.error('Error saving to local persistence:', error.message);
            throw error;
        }
    }

    /**
     * Get all tracked applications
     */
    getApplications() {
        try {
            return JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf8'));
        } catch (error) {
            return [];
        }
    }
}

module.exports = new PersistenceService();
