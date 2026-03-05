# Title Similarity & Compliance Validation System

An intelligent system to verify new publication titles against 160,000 existing titles for phonetic and semantic similarity, while enforcing regulatory rules.

## Core Features
1. **Similarity Detection**: Implements Levenshtein, Jaro-Winkler, and Phonetic (Soundex/Metaphone) matching algorithms.
2. **Prefix & Suffix Handling**: Strips and handles common word prefixes before making core similarity checks.
3. **Rule-Based Compliance Engine**: Maintains blacklists for terms like "Police, Crime, Corruption", and prevents periodicity modifications (e.g., adding "Daily" or "Weekly").
4. **Semantic Similarity (NLP Vector Store)**: Uses `sentence-transformers` and FAISS vector database to detect conceptually identical titles (e.g. "Morning Herald" vs "Sunrise Chronicle").
5. **Validation Pipeline Orchestration**: Microservices funnel and generate a calculated Probability approval percentage for each title.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: PostgreSQL (or MySQL)
- NLP Engine: Python (Sentence Transformers + FAISS)

## Directory Structure
- `frontend/`: React UI for submissions
- `backend/`: Node.js + Express core API layer and validation orchestrator
- `nlp-engine/`: Python-based semantic similarity checking service
- `database/`: Database schema and seed scripts
- `datasets/`: Initial datasets for testing
- `docker/`: Docker containerization configs
- `docs/`: System documentation
