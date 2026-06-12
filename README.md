# 🚀 Nutri AI

## AI-Powered Nutrition & Productivity Intelligence Platform

NutriPilot AI is a production-grade AI platform that combines nutrition tracking, wellness analytics, hydration monitoring, productivity intelligence, and AI-powered recommendations into a single intelligent ecosystem.

The system helps users understand how nutrition, hydration, and lifestyle choices impact focus, energy levels, wellness, and productivity through real-time analytics and personalized AI insights.

---

## 📌 Features

### 🥗 Nutrition Intelligence

* Food Search & Discovery
* Nutrition Information Analysis
* Calorie Tracking
* Macronutrient Monitoring
* Meal Logging
* Personalized Nutrition Insights

### 💧 Hydration Tracking

* Water Intake Monitoring
* Hydration Score Calculation
* Smart Hydration Alerts
* Daily Hydration Analytics

### 📈 Productivity Intelligence

* Energy Level Tracking
* Focus Performance Analysis
* Productivity Metrics
* Wellness-Based Productivity Recommendations

### 🤖 AI Recommendation Engine

* Personalized Meal Suggestions
* Nutrition Optimization
* Wellness Recommendations
* Productivity Improvement Insights

### 📊 Real-Time Analytics

* Interactive Dashboards
* Nutrition Trends
* Wellness Reports
* Performance Analytics
* Live Data Updates

### ⚡ Real-Time Communication

* WebSocket Integration
* Instant Dashboard Updates
* Live Recommendation Updates
* Event-Based Notifications

---

# 🏗️ Architecture

```plaintext
Frontend (Next.js)
        │
        ▼
API Gateway
        │
        ▼
FastAPI Backend
        │
        ▼
Service Layer
        │
        ▼
AI Agent Orchestrator
        │
        ▼
RAG System
        │
        ▼
Vector Database
        │
        ▼
PostgreSQL Database
```

---

# 🧠 AI Agent System

The platform uses multiple specialized AI agents:

## Nutrition Agent

Responsible for:

* Nutrition Analysis
* Meal Recommendations
* Macro Evaluation
* Dietary Suggestions

## Productivity Agent

Responsible for:

* Focus Analysis
* Energy Optimization
* Productivity Scoring
* Performance Recommendations

## Analytics Agent

Responsible for:

* Trend Analysis
* Wellness Metrics
* Reporting
* Data Insights

## Planner Agent

Responsible for:

* Meal Planning
* Daily Scheduling
* Personalized Workflows

---

# 🔍 RAG (Retrieval-Augmented Generation)

The platform incorporates a RAG architecture to provide context-aware intelligence.

### Capabilities

* Semantic Search
* AI Memory
* Context Retrieval
* Personalized Recommendations
* Intelligent Knowledge Access

### Vector Database

* ChromaDB
* FAISS

### Embedding Models

* OpenAI Embeddings
* BGE Embeddings
* Sentence Transformers

---

# 💻 Tech Stack

## Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* Shadcn UI
* Framer Motion
* Zustand
* TanStack Query
* Recharts
* Axios

## Backend

* FastAPI
* Python 3.12+
* SQLAlchemy
* Alembic
* PostgreSQL
* Redis
* Celery
* WebSockets
* JWT Authentication
* OAuth2

## AI & ML

* OpenAI
* LangChain
* LiteLLM
* Instructor
* Sentence Transformers

## Monitoring

* Prometheus
* Grafana
* Loguru
* Structlog

## Deployment

* Vercel
* Railway
* Render
* AWS ECS
* Supabase
* Neon PostgreSQL

---

# 📂 Project Structure

```plaintext
NutriPilot-AI/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── store/
│
├── backend/
│   ├── api/
│   ├── models/
│   ├── services/
│   ├── agents/
│   ├── database/
│   └── schemas/
│
├── rag/
│   ├── embeddings/
│   ├── retriever/
│   ├── indexing/
│   └── vectorstore/
│
├── workers/
│
├── dataset/
│
├── docs/
│
└── docker/
```

---

# 🔐 Security Features

* JWT Authentication
* OAuth2 Authorization
* Password Hashing
* Secure Cookies
* Rate Limiting
* Request Validation
* Environment Variable Protection
* Secure API Middleware

---

# 📊 Analytics

The platform continuously evaluates:

### Nutrition Metrics

* Calories
* Protein
* Carbohydrates
* Fats

### Wellness Metrics

* Hydration Score
* Nutrition Score
* Wellness Index

### Productivity Metrics

* Energy Levels
* Focus Score
* Productivity Performance

---

# ⚙️ Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
OPENAI_API_KEY=
REDIS_URL=
CHROMA_DB_PATH=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
```

---

# 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/NutriPilot-AI.git
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Docker

```bash
docker-compose up --build
```

---

# 🎯 Future Roadmap

* AI Meal Image Recognition
* Voice-Based Food Logging
* Wearable Device Integration
* Advanced Wellness Intelligence
* Predictive Analytics
* Mobile Application
* Multi-Language Support
* AI Health Assistant

---

# 🌟 Key Highlights

✅ AI-Powered Recommendations

✅ Real-Time Analytics

✅ Multi-Agent Architecture

✅ RAG-Based Intelligence

✅ WebSocket Communication

✅ Production-Ready Backend

✅ Scalable Cloud Architecture

✅ Personalized Wellness Insights

---

# 👨‍💻 Author

**DHANRAJ R**

AI Engineer | Full Stack Developer | AI Agent Systems Builder

Passionate about building intelligent systems that combine AI, automation, analytics, and real-world impact.

---

⭐ If you found this project useful, consider starring the repository.
