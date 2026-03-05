# Title Verification System 🚀

A high-performance, AI-powered system designed to verify publication titles against a large database. It ensures uniqueness, semantic compliance, and similarity checks using phonetic and NLP algorithms.

## 🏗 Architecture
The system follows a microservices architecture:
- **Frontend**: React + Vite + Lucide Icons (Responsive UI)
- **Backend API**: Node.js + Express + PostgreSQL (Title Management & Business Logic)
- **NLP Engine**: Python + Flask + Sentence Transformers + FAISS (AI Semantic Search)
- **Database**: PostgreSQL (Managed)

## ✨ key Features
- **Phonetic Matching**: Detects titles that sound identical to existing ones.
- **AI Semantic Search**: Finds conceptually similar titles using vector embeddings.
- **Automated Validation**: Instant probability scoring for title approval.
- **Cloud Ready**: Configured for automated deployment via Render and Netlify.
- **Dockerized**: Fully orchestrated local environment using Docker Compose.

## 🚀 Live Services
- **Frontend UI**: [title-verification-system.netlify.app](https://title-verification-system.netlify.app)
- **Backend API**: [backend-htpm.onrender.com](https://backend-htpm.onrender.com)
- **NLP Engine**: [nlp-engine-exjd.onrender.com](https://nlp-engine-exjd.onrender.com)

## 🛠 Local Setup

### Using Docker (Recommended)
1. Clone the repository.
2. Run `docker-compose -f docker/docker-compose.yml up --build`.
3. Open `http://localhost:5173` in your browser.

### Manual Setup (Development)
Each service has its own `README.md` inside its folder for specific development instructions.

## 📝 Problem Statement: PRGI Title Verification
**The Challenge**: Press Registrar General of India (PRGI) manages ~160,000 titles. New submissions must be unique, non-confusing, and compliant with strict regulatory guidelines.
**The Solution**: A system that automatically rejects titles based on:
- **Similarity**: Phonetic (Soundex/Metaphone) and string matching (Levenshtein).
- **Guidelines**: Disallowed words (e.g., Police, Army), periodicity additions, and conceptual themes (e.g., Morning Herald vs Sunrise Chronicle).
- **Combinations**: Prevents mixing existing titles to form new ones.
- **Languages**: Rejects titles with similar meanings in different languages.

## 📁 Project Structure
```text
title-verification-system/
├── backend/                # Node.js + Express API
│   ├── src/                # Business logic, routes, and services
│   ├── database/           # SQL schema and seed data
│   └── Dockerfile          # Production Docker config
├── frontend/               # React (Vite) Frontend
│   ├── src/                # UI components and assets
│   ├── netlify.toml        # Netlify cloud config
│   └── Dockerfile          # Frontend Docker config
├── nlp-engine/             # Python AI Service
│   ├── api/                # Flask API endpoints
│   ├── model/              # NLP model loading and logic
│   └── Dockerfile          # Python/FAISS Docker config
├── docker/                 # Local orchestration
│   └── docker-compose.yml  # Multi-container setup
├── datasets/               # Reference datasets (JSON/CSV)
└── render.yaml             # Render Blueprint for cloud deployment
```

---
**Developed for the Title Identity Compliance Hackathon.**
