const indexService = require('../../backend/src/services/indexService');
const validationPipeline = require('../../backend/src/services/validationPipeline');

beforeAll(async () => {
    await indexService.loadTitles();
});

describe('Title Verification Pipeline Integration Tests', () => {
    test('should approve a unique title that complies with rules', async () => {
        const res = await validationPipeline.process('Unique Chronicle');
        expect(res.status).toBe('Approved');
        expect(res.similarity_score).toBeLessThan(76);
        expect(res.violations).toHaveLength(0);
    });

    test('should reject a title with disallowed words', async () => {
        const res = await validationPipeline.process('Police Bulletin');
        expect(res.status).toBe('Rejected');
        expect(res.violations).toContainEqual(expect.stringContaining('disallowed word'));
    });

    test('should detect high similarity for near-duplicate titles', async () => {
        // 'Daily Tribune' is in mock titles; an exact match should be caught
        const res = await validationPipeline.process('Daily Tribune');
        expect(res.similarity_score).toBeGreaterThanOrEqual(70);
    });

    test('should reject a title that matches an existing title exactly', async () => {
        const res = await validationPipeline.process('Indian Express');
        expect(res.status).toBe('Rejected');
        expect(res.similarity_score).toBe(100);
    });

    test('should flag linguistic translation patterns', async () => {
        const res = await validationPipeline.process('Pratidin Sandhya');
        expect(res.violations).toContainEqual(expect.stringContaining('linguistic pattern'));
    });
});
