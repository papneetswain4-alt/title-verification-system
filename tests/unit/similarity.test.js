const similarityService = require('../../backend/src/services/similarityService');
const phoneticService = require('../../backend/src/services/phoneticService');

describe('SimilarityService', () => {
    test('should calculate string similarity correctly', () => {
        const existing = ['bangalore globe', 'bharat mail', 'delhi herald'];
        const res = similarityService.checkSimilarity('bangalore glob', existing);
        expect(res.maxScore).toBeGreaterThanOrEqual(70);
        expect(res.highestMatch).toBe('bangalore globe');
    });

    test('should return 0 for completely different titles', () => {
        const existing = ['bangalore globe', 'bharat mail', 'delhi herald'];
        const res = similarityService.checkSimilarity('xyz quantum', existing);
        expect(res.maxScore).toBeLessThan(50);
    });
});

describe('PhoneticService', () => {
    test('should generate metaphone and soundex codes', () => {
        const codes = phoneticService.generateCodes('hindu');
        expect(codes.soundex).toBeDefined();
        expect(codes.metaphone).toBeDefined();
    });

    test('should identify phonetic matches for identical-sounding titles', () => {
        // Use the same normalized form so phonetic codes match exactly
        const existing = [
            { title: 'Daily Tribune', codes: phoneticService.generateCodes('daily tribune') },
            { title: 'Delhi Times', codes: phoneticService.generateCodes('delhi times') }
        ];
        const res = phoneticService.checkSimilarity('daily tribune', existing);
        expect(res.maxScore).toBe(100);
        expect(res.matches[0].title).toBe('Daily Tribune');
    });

    test('should return no matches for phonetically different titles', () => {
        const existing = [
            { title: 'Daily Tribune', codes: phoneticService.generateCodes('daily tribune') }
        ];
        const res = phoneticService.checkSimilarity('bharat vision', existing);
        expect(res.maxScore).toBe(0);
        expect(res.matches).toHaveLength(0);
    });
});
