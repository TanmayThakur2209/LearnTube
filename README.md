<h1>
<img src="https://raw.githubusercontent.com/TanmayThakur2209/LearnTube/refs/heads/main/client/src/assets/logo1.svg" 
       width="30" 
        />
# LearnTube
</h1>
LearnTube is an AI-powered Retrieval-Augmented Generation (RAG) application that transforms long-form videos into an interactive knowledge base. Instead of manually searching through hours of content, users can import a YouTube video and ask natural language questions to receive context-aware answers grounded entirely in the video's transcript.

The platform automatically extracts subtitles, chunks the transcript, generates semantic embeddings, performs hybrid retrieval using vector search and full-text search, reranks results with a cross-encoder, and generates accurate answers using Gemini.

---

## Features

- Import any YouTube video
- Automatic subtitle extraction using yt-dlp
- Transcript cleaning and semantic chunking
- Dense vector embeddings using BAAI/bge-small-en-v1.5
- Hybrid Retrieval (Semantic + Keyword Search)
- Retrieval-Augmented Generation (RAG)
- Hybrid Search (Dense + Sparse Retrieval)
- Vector Similarity Search using pgvector
- Cross-Encoder reranking using BAAI/bge-reranker-base
- Conversational video chat with Gemini 2.5 Flash
- Conversation history
- JWT Authentication
- Background processing using Celery
- PostgreSQL + pgvector storage
- Responsive React frontend
- Real-time streaming AI responses
- Fully asynchronous FastAPI backend

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- FastAPI
- SQLAlchemy Async
- PostgreSQL
- pgvector
- Redis
- Celery

### AI Stack

- Gemini 2.5 Flash
- BAAI/bge-small-en-v1.5
- BAAI/bge-reranker-base
- Hybrid Retrieval
- PostgreSQL Full Text Search

### Infrastructure

- Docker
- Railway
- GitHub

---

# System Architecture

```
                YouTube URL
                     │
                     ▼
            Video Import API
                     │
                     ▼
          Fetch Video Metadata
                     │
                     ▼
          Celery Background Task
                     │
                     ▼
          Download English Subtitles
                     │
                     ▼
            Clean Transcript
                     │
                     ▼
             Semantic Chunking
                     │
                     ▼
          Generate Embeddings
                     │
                     ▼
          Store in PostgreSQL
              + pgvector
                     │
──────────────────────────────────────────

               User Question
                     │
                     ▼
          Generate Query Embedding
                     │
                     ▼
        Semantic Vector Search
                     │
                     ▼
        PostgreSQL Full Text Search
                     │
                     ▼
          Merge Candidate Chunks
                     │
                     ▼
      Cross Encoder Re-ranking
                     │
                     ▼
          Top Context Chunks
                     │
                     ▼
            Gemini 2.5 Flash
                     │
                     ▼
              Streaming Answer
```

---

# Retrieval Pipeline

```
User Question
      │
      ▼
Embedding Generation
      │
      ▼
Semantic Search (20)
      │
      ▼               
Keyword Search (20)
      │
      ▼
Merge Results
      │
      ▼
Cross Encoder Reranking
      │
      ▼
Top 5 Chunks
      │
      ▼
Gemini Prompt
      │
      ▼
Final Answer
```

---

# Project Structure

```
LearnTube
│
├── client
│   ├── src
│   ├── components
│   ├── pages
│   ├── services
│   └── hooks
│
├── server
│   ├── app
│   │   ├── api
│   │   ├── models
│   │   ├── repositories
│   │   ├── services
│   │   ├── tasks
│   │   ├── schemas
│   │   ├── db
│   │   └── core
│   │
│   ├── alembic
│   └── requirements.txt
│
└── docker-compose.yml
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/TanmayThakur2209/LearnTube.git

cd LearnTube
```

---

## Backend

```bash
cd server

python -m venv .venv

source .venv/bin/activate
```

Windows

```powershell
.venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

## Frontend

```bash
cd client

npm install
```

---

## Environment Variables

Create a `.env` file inside the server folder.

```env
DATABASE_URL=
REDIS_URL=

JWT_SECRET=

GOOGLE_API_KEY=

YOUTUBE_COOKIES_B64=

```

---

## Start PostgreSQL and Redis

```bash
docker compose up -d
```

---

## Run Database Migrations

```bash
alembic upgrade head
```

---

## Start Backend

```bash
uvicorn app.main:app --reload
```

---

## Start Celery

```bash
celery -A app.celery.celery_app worker --pool=solo --concurrency=1 --loglevel=info
```

---

## Start Frontend

```bash
npm run dev
```

---

# How It Works

### 1. Import Video

The user submits a YouTube URL.

---

### 2. Background Processing

Celery downloads subtitles, cleans the transcript, chunks it into semantic sections, generates embeddings, and stores everything in PostgreSQL.

---

### 3. Ask Questions

Users ask natural language questions about the video.

---

### 4. Retrieval

The system performs:

- Semantic vector search
- PostgreSQL full-text search
- Candidate merging
- Cross-Encoder reranking

---

### 5. Generation

The highest-ranked transcript chunks are sent to Gemini, which generates an answer strictly grounded in the retrieved context.

---
---

# API Reference

## Authentication

| Method | Endpoint | Description |
| :----: | -------- | ----------- |
| POST | `/auth/register` | Register a new user account |
| POST | `/auth/login` | Authenticate and receive a JWT access token |

---

## Videos

| Method | Endpoint | Description |
| :----: | -------- | ----------- |
| POST | `/videos/import` | Import a YouTube video for processing |
| GET | `/videos` | Retrieve all videos imported by the authenticated user |
| GET | `/videos/{video_id}` | Retrieve metadata for a specific video |

---

## Search

| Method | Endpoint | Description |
| :----: | -------- | ----------- |
| GET | `/videos/{video_id}/search` | Perform hybrid semantic and keyword search over the transcript |

---

## AI Chat

| Method | Endpoint | Description |
| :----: | -------- | ----------- |
| POST | `/videos/{video_id}/chat` | Generate an AI answer using Retrieval-Augmented Generation (RAG) |
| POST | `/videos/{video_id}/chat/stream` | Stream the AI response token-by-token using Server-Sent Events (SSE) |

---

# Deployment

| Component | Platform |
| --------- | -------- |
| Frontend | Vercel |
| Backend | Railway |
| Database | PostgreSQL |
| Vector Database | pgvector |
| Background Jobs | Celery |
| Message Broker | Redis |

---
# AI Models

| Task | Model |
|------|-------|
| Embeddings | BAAI/bge-small-en-v1.5 |
| Reranking | BAAI/bge-reranker-base |
| Generation | Gemini 2.5 Flash |

---

# Live Preview

The project is deployed and can be accessed through the following link: https://learntubeai.vercel.app/



---

# License

This project is licensed under the MIT License.

---

# Author

**Tanmay Thakur**

GitHub: https://github.com/TanmayThakur2209

LinkedIn: https://www.linkedin.com/in/tanmaythakur22

---

If you found this project useful, consider giving it a ⭐ on GitHub.
