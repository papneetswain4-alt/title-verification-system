const natural = require('natural');

class PhoneticService {
    constructor() {
        this.metaphone = new natural.Metaphone();
        this.soundex = new natural.SoundEx();
    }

    /**
     * Generate phonetic codes for a title
     * @param {string} title 
     * @returns {Object} containing soundex and metaphone codes
     */
    generateCodes(title) {
        if (!title) return { soundex: '', metaphone: '' };
        return {
            soundex: this.soundex.process(title),
            metaphone: this.metaphone.process(title)
        };
    }

    /**
     * Check if the phonetic representation of a candidate title matches any existing phonetic representations.
     * @param {string} title 
     * @param {Object[]} existingTitlesData [{title: 'foo', codes: {metaphone: 'F'}}]
     * @returns {Object} result payload indicating phonetically similar titles found
     */
    checkSimilarity(title, existingTitlesData) {
        const candidateCodes = this.generateCodes(title);
        let maxPhoneticScore = 0;
        const phoneticMatches = [];

        // Simple straight phonetic equality checking
        for (const existing of existingTitlesData) {
            let matched = false;

            // Check Metaphone first as it is generally more accurate for English.
            if (candidateCodes.metaphone && existing.codes.metaphone &&
                candidateCodes.metaphone === existing.codes.metaphone) {
                matched = true;
            } else if (candidateCodes.soundex && existing.codes.soundex &&
                candidateCodes.soundex === existing.codes.soundex) {
                matched = true;
            }

            if (matched) {
                maxPhoneticScore = 100; // Exact phonetic match is considered highly similar
                phoneticMatches.push({ title: existing.title, score: 100, reason: 'Phonetic Match' });
                if (phoneticMatches.length >= 5) break;
            }
        }

        return {
            maxScore: maxPhoneticScore,
            matches: phoneticMatches
        };
    }
}

module.exports = new PhoneticService();
