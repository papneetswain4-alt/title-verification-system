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
- **Backend API**: [backend-htpm.onrender.com](https://backend-htpm.onrender.com)
- **NLP Engine**: [nlp-engine-exjd.onrender.com](https://nlp-engine-exjd.onrender.com)

## 🛠 Local Setup

### Using Docker (Recommended)
1. Clone the repository.
2. Run `docker-compose -f docker/docker-compose.yml up --build`.
3. Open `http://localhost:5173` in your browser.

### Manual Setup (Development)
Each service has its own `README.md` inside its folder for specific development instructions.

## ☁️ Cloud Deployment
The project is configured for:
- **Render**: Blueprint available in `render.yaml` for Backend, AI Engine, and DB.
- **Netlify**: Configured in `frontend/netlify.toml` for the Frontend.

---
**Developed for the Title Identity Compliance Hackathon.**
