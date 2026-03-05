const axios = require('axios');

class SemanticService {
    constructor() {
        // In production, this would be an env var pointing to the internal cluster IP
        this.nlpEndpoint = process.env.NLP_SERVICE_URL || 'http://localhost:5000/api/v1/semantic';
    }

    /**
     * Check if the title has conceptual similarity to existing titles using embeddings 
     * by querying the Python NLP microservice.
     * 
     * @param {string} candidateTitle 
     * @returns {Object} { maxScore: number, matches: Array }
     */
    async checkSimilarity(candidateTitle) {
        try {
            const response = await axios.post(`${this.nlpEndpoint}/verify`, {
                title: candidateTitle
            });
            return response.data;
        } catch (error) {
            console.error('Error connecting to NLP semantic service', error.message);
            // Non-blocking fallback if Python service is down
            return { maxScore: 0, matches: [] };
        }
    }
}

module.exports = new SemanticService();
