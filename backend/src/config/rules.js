module.exports = {
    DISALLOWED_WORDS: [
        'police',
        'crime',
        'cbi',
        'cid',
        'army',
        'corruption'
    ],
    PREFIXES: [
        'the',
        'a',
        'an',
        'shri',
        'shrimati'
    ],
    SUFFIXES: [
        'news',
        'samachar',
        'times',
        'herald',
        'chronicle',
        'dispatch',
        'post',
        'tribune',
        'patrika',
        'daily',
        'weekly',
        'monthly'
    ],
    PERIODICITY_TERMS: [
        'daily',
        'weekly',
        'monthly',
        'yearly',
        'annual',
        'fortnightly',
        'evening',
        'morning',
        'sandhya',
        'pratidin',
        'din',
        'saptahik',
        'masik'
    ],
    LINGUISTIC_MAPPINGS: {
        'pratidin': 'daily',
        'sandhya': 'evening',
        'samachar': 'news',
        'patrika': 'record',
        'saptahik': 'weekly'
    }
};
