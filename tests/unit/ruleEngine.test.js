const ruleEngine = require('../../backend/src/services/ruleEngine');

describe('RuleEngine', () => {
    test('should allow valid normalized titles', () => {
        const res = ruleEngine.evaluate('morning chronicle');
        expect(res.isValid).toBe(true);
        expect(res.violations).toHaveLength(0);
    });

    test('should reject disallowed words', () => {
        const res = ruleEngine.evaluate('police times');
        expect(res.isValid).toBe(false);
        expect(res.violations).toContain('Contains disallowed word(s): police');
    });

    test('should identify linguistic pattern translation', () => {
        const res = ruleEngine.evaluate('pratidin sandhya');
        expect(res.translatedTitle).toBe('daily evening');
    });
});
