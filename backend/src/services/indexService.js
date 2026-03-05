const db = require('../config/db');
const phoneticService = require('./phoneticService');
const normalizationService = require('./normalizationService');

class IndexService {
    constructor() {
        // In-memory cache of titles for fast lookup
        this.cache = [];
        this.isLoaded = false;
    }

    /**
     * Loads titles from the database and caches them along with precomputed phonetic codes.
     */
    async loadTitles() {
        console.log('Loading existing titles into memory index...');
        try {
            // Note: In an extreme scale system, we wouldn't load 160k records straight into one node array
            // without careful memory profiling, or we would use an external vector DB/Redis search. 
            // For the hackathon scope (160k is ~10MB of text), an array is usually fine.
            // Load both approved publications and recent pending applications
            const pubRes = await db.query('SELECT title, normalized_title, phonetic_code FROM publications WHERE status = $1', ['Approved']);
            const appRes = await db.query('SELECT submitted_title as title, normalized_title, id FROM application_queue WHERE status = $1', ['Pending']);

            const allRows = [...pubRes.rows];
            // Add pending apps to the rows to check against
            appRes.rows.forEach(app => {
                allRows.push({
                    title: app.title,
                    normalized_title: app.normalized_title,
                    phonetic_code: null // Will be generated below
                });
            });

            this.cache = allRows.map(row => ({
                title: row.title,
                normalized: row.normalized_title,
                codes: row.phonetic_code
                    ? JSON.parse(row.phonetic_code)
                    : phoneticService.generateCodes(row.normalized_title)
            }));

            this.isLoaded = true;
            console.log(`Loaded ${this.cache.length} titles into memory index.`);

            // Seed semantic engine
            this.seedSemanticEngine();
        } catch (error) {
            console.error('Failed to load titles from DB, running in degraded/mock mode.', error.message);
            this.loadMockTitles();
        }
    }

    async seedSemanticEngine() {
        const axios = require('axios');
        const nlpUrl = process.env.NLP_SERVICE_URL
            ? process.env.NLP_SERVICE_URL.replace('/verify', '/seed')
            : 'http://localhost:5000/api/v1/semantic/seed';

        try {
            const titlesToSeed = this.cache.map(item => item.title);
            if (titlesToSeed.length > 0) {
                console.log(`Seeding ${titlesToSeed.length} titles into NLP Semantic Engine...`);
                await axios.post(nlpUrl, { titles: titlesToSeed });
                console.log('NLP Semantic Engine seeded successfully.');
            }
        } catch (error) {
            console.error('Failed to seed NLP Semantic Engine. Conceptual similarity checks will be empty.', error.message);
        }
    }

    loadMockTitles() {
        console.log('Loading mock titles and local persistence as fallback...');
        const mockTitles = [
            'The Hindu',
            'Indian Express',
            'Morning Herald',
            'Daily Tribune',
            'The Times of India',
            'Daily Evening',
            'Sunrise Chronicle',
            'Dawn Dispatch',
            'Namaskar'
        ];

        // Load from local storage if any
        const persistenceService = require('./persistenceService');
        const localApps = persistenceService.getApplications();

        const allTitles = [...mockTitles, ...localApps.map(app => app.submitted_title)];

        this.cache = allTitles.map(title => {
            const normalized = normalizationService.normalize(title);
            return {
                title: title,
                normalized: normalized,
                codes: phoneticService.generateCodes(normalized)
            };
        });
        this.isLoaded = true;
    }

    /**
     * Get the list of all cached title records
     */
    getCache() {
        if (!this.isLoaded) {
            console.warn('Warning: Title index is not yet fully loaded');
        }
        return this.cache;
    }

    /**
     * Extract just the normalized text forms from the cache
     */
    getNormalizedStrings() {
        return this.cache.map(entry => entry.normalized);
    }

    /**
     * Add a newly submitted title to the cache in real-time
     */
    addTitleToCache(title) {
        const normalized = normalizationService.normalize(title);
        this.cache.push({
            title: title,
            normalized: normalized,
            codes: phoneticService.generateCodes(normalized)
        });
        console.log(`Title "${title}" added to real-time index.`);
    }
}

// Export as singleton to share memory space
module.exports = new IndexService();
