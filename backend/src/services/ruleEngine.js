const rules = require('../config/rules');

class RuleEngine {
    /**
     * Evaluate a normalized title against static compliance rules
     * @param {string} normalizedTitle 
     * @returns {Object} result containing a boolean block indicator and list of violations
     */
    evaluate(normalizedTitle) {
        const violations = [];
        const words = normalizedTitle.split(' ');

        // 1. Check for Disallowed Words
        const foundDisallowed = words.filter(word => rules.DISALLOWED_WORDS.includes(word));
        if (foundDisallowed.length > 0) {
            violations.push(`Contains disallowed word(s): ${foundDisallowed.join(', ')}`);
        }

        // 3. Multi-language conceptual check (Requirement 3d)
        // If "Daily Evening" exists and "Pratidin Sandhya" is submitted,
        // we check if the translated core words match.
        const translatedWords = words.map(word => rules.LINGUISTIC_MAPPINGS[word] || word);
        const translatedTitle = translatedWords.join(' ');

        if (translatedTitle !== normalizedTitle) {
            violations.push(`Matches linguistic pattern: ${translatedTitle}`);
        }

        return {
            isValid: violations.length === 0,
            violations,
            translatedTitle // For further comparison in pipeline if needed
        };
    }
}

module.exports = new RuleEngine();
