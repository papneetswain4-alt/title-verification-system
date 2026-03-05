const rules = require('../config/rules');

class NormalizationService {
    /**
     * Normalize a title for comparison and rule checking
     * @param {string} title 
     * @returns {string} Normalized title
     */
    normalize(title) {
        if (!title) return '';

        // 1. Lowercase
        let normalized = title.toLowerCase();

        // 2. Remove punctuation and special characters
        normalized = normalized.replace(/[^\w\s]/gi, '');

        // 3. Trim extra spaces
        normalized = normalized.trim().replace(/\s+/g, ' ');

        return normalized;
    }

    /**
     * Strip predefined prefixes and suffixes to get the core title word(s)
     * @param {string} normalizedTitle (must be already normalized)
     * @returns {string} Stripped title
     */
    stripAffixes(normalizedTitle) {
        let words = normalizedTitle.split(' ');

        // Remove prefixes from start
        while (words.length > 0 && rules.PREFIXES.includes(words[0])) {
            words.shift();
        }

        // Remove suffixes from end
        while (words.length > 0 && rules.SUFFIXES.includes(words[words.length - 1])) {
            words.pop();
        }

        // It's possible the entire title consisted of just prefixes/suffixes
        // Return original normalized if we stripped everything, else the stripped version
        if (words.length === 0) return normalizedTitle;

        return words.join(' ');
    }
}

module.exports = new NormalizationService();
