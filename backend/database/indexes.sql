-- Ensure efficient lookup for normalization and status
CREATE INDEX IF NOT EXISTS idx_publications_normalized ON publications(normalized_title);
CREATE INDEX IF NOT EXISTS idx_publications_status ON publications(status);
CREATE INDEX IF NOT EXISTS idx_application_queue_title ON application_queue(submitted_title);
CREATE INDEX IF NOT EXISTS idx_application_queue_status ON application_queue(status);
