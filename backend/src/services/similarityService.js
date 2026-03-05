const stringSimilarity = require('string-similarity');

class SimilarityService {
    /**
     * Check string similarity between a normalized title and existing database titles using string-similarity.
     * Note: In a production system, this would be backed by `indexService` passing batches of titles
     * instead of full DB table scan immediately.
     * 
     * @param {string} normalizedTitle The title being verified
     * @param {string[]} existingTitles Array of existing normalized titles
     * @returns {Object} { maxScore: number, similarTitles: string[], highestMatch: string }
     */
    checkSimilarity(normalizedTitle, existingTitles) {
        if (!existingTitles || existingTitles.length === 0) {
            return { maxScore: 0, similarTitles: [], highestMatch: null };
        }

        const matches = stringSimilarity.findBestMatch(normalizedTitle, existingTitles);

        // Filter and collect potential clashes (e.g. >= 0.70 score)
        const threshold = 0.70;
        const potentialClashes = matches.ratings
            .filter(rating => rating.rating >= threshold)
            .sort((a, b) => b.rating - a.rating)
            .map(match => ({ target: match.target, score: Math.round(match.rating * 100) }));

        // Only return the top 5 for UX rendering
        const topClashes = potentialClashes.slice(0, 5);

        return {
            maxScore: Math.round(matches.bestMatch.rating * 100),
            highestMatch: matches.bestMatch.target,
            similarTitles: topClashes
        };
    }
}

module.exports = new SimilarityService();
