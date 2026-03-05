CREATE TABLE IF NOT EXISTS publications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    normalized_title VARCHAR(255) NOT NULL,
    phonetic_code VARCHAR(50),
    language VARCHAR(50),
    periodicity VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application_queue (
    id SERIAL PRIMARY KEY,
    submitted_title VARCHAR(255) NOT NULL,
    normalized_title VARCHAR(255) NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending',
    similarity_score INTEGER,
    rejection_reasons JSONB
);
