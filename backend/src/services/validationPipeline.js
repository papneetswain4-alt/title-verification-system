/**
 * Validation Pipeline Orchestrator
 * This service controls the flow of validating a title through normalization,
 * rules, text similarity, phonetic similarity, and semantic similarity via NLP engine.
 */

const normalizationService = require('./normalizationService');
const ruleEngine = require('./ruleEngine');
const similarityService = require('./similarityService');
const phoneticService = require('./phoneticService');
const probabilityService = require('./probabilityService');
const indexService = require('./indexService');
const semanticService = require('./semanticService');

class ValidationPipeline {
    /**
     * Process an incoming title through the pipeline
     * @param {string} rawTitle 
     * @returns {Promise<Object>} Verification Result Payload
     */
    async process(rawTitle) {
        let violations = [];
        let maxSimilarityScore = 0;
        let similarTitles = [];
        let detectedBy = [];

        // 1. Normalize Text (Lowercase, strip punctuation/stopwords/common prefixes)
        const normalizedTitle = normalizationService.normalize(rawTitle);
        const strippedTitle = normalizationService.stripAffixes(normalizedTitle);

        // 2. Rule Engine (Disallowed words, periodicity)
        const ruleResult = ruleEngine.evaluate(normalizedTitle);
        if (ruleResult.violations.length > 0) violations.push(...ruleResult.violations);

        // 2b. Check for combinations of existing titles (Requirement 3c)
        const existingNormalized = indexService.getNormalizedStrings();
        const combinations = this._checkCombinations(normalizedTitle, existingNormalized);
        if (combinations.length >= 2) {
            violations.push(`Title appears to be a combination of existing titles: ${combinations.join(', ')}`);
        }

        // 3. Similarity Engine (Levenshtein, Jaro-Winkler)
        // Extract plain strings for string-similarity
        const lexicalSim = similarityService.checkSimilarity(strippedTitle, existingNormalized);

        if (lexicalSim.maxScore > maxSimilarityScore) {
            maxSimilarityScore = lexicalSim.maxScore;

            if (lexicalSim.maxScore >= 70) {
                detectedBy.push('fuzzy_match');
                // Only add ones > threshold, for simplicity grabbing the highest match here
                if (!similarTitles.includes(lexicalSim.highestMatch)) {
                    similarTitles.push(lexicalSim.highestMatch);
                }
            }
        }

        // 4. Phonetic Engine (Soundex, Metaphone)
        const cachedData = indexService.getCache();
        const phoneticSim = phoneticService.checkSimilarity(strippedTitle, cachedData);

        if (phoneticSim.maxScore > maxSimilarityScore) {
            maxSimilarityScore = phoneticSim.maxScore;
        }

        if (phoneticSim.maxScore === 100) {
            detectedBy.push('phonetic_match');
            phoneticSim.matches.forEach(m => {
                if (!similarTitles.includes(m.title)) {
                    similarTitles.push(m.title);
                }
            });
        }

        // 5. Semantic Engine (NLP embeddings via Python microservice)
        const semanticSim = await semanticService.checkSimilarity(strippedTitle);

        if (semanticSim.maxScore > maxSimilarityScore) {
            maxSimilarityScore = semanticSim.maxScore;
        }

        if (semanticSim.maxScore >= 75) {
            detectedBy.push('semantic_match');
            semanticSim.matches.forEach(m => {
                if (!similarTitles.includes(m.title)) {
                    similarTitles.push(m.title);
                }
            });
        }

        // 6. Probability Engine
        const verificationProbability = probabilityService.calculate(maxSimilarityScore, violations);

        const finalResult = {
            title: rawTitle,
            status: (violations.length > 0 || maxSimilarityScore > 75) ? 'Rejected' : 'Approved',
            similar_titles: similarTitles,
            similarity_score: maxSimilarityScore,
            detected_by: detectedBy,
            violations,
            verification_probability: verificationProbability
        };

        // 7. Track Application (Requirement 5b)
        try {
            const persistenceService = require('./persistenceService');
            await persistenceService.trackApplication({
                submitted_title: rawTitle,
                normalized_title: normalizedTitle,
                status: finalResult.status,
                similarity_score: maxSimilarityScore,
                violations: violations
            });

            // 8. Add to real-time index for future reference (Requirement 3c/5b)
            indexService.addTitleToCache(rawTitle);
        } catch (e) {
            console.error('Failed to track application:', e.message);
        }

        return finalResult;
    }

    /**
     * Check if the title is a combination of existing titles (Requirement 3c)
     * e.g. "Hindu Indian Express" if "Hindu" and "Indian Express" exist.
     */
    _checkCombinations(normalizedTitle, existingTitles) {
        // Simple heuristic: check if multiple existing titles exist as whole word substrings
        let count = 0;
        const matches = [];

        // Sort existing titles by length descending to match longest possible titles first
        const sortedExisting = [...existingTitles].sort((a, b) => b.length - a.length);

        for (const existing of sortedExisting) {
            if (existing.length < 3) continue;

            // Avoid double counting if we already found a match that contains this title
            if (matches.some(m => m.includes(existing))) continue;

            const escaped = existing.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'i');

            if (regex.test(normalizedTitle) && existing !== normalizedTitle) {
                count++;
                matches.push(existing);
            }
        }

        return count >= 2 ? matches : [];
    }
}

module.exports = new ValidationPipeline();
