# SKILL.MD

# AI NUTRITION PRODUCTIVITY AGENT

# FULL PROJECT TECH STACK & ARCHITECTURE

---

# PROJECT OVERVIEW

Project Name:
AI Nutrition Productivity Agent

Project Type:
Production-Grade Real-Time AI SaaS Platform

Project Goal:
Build an AI-powered nutrition intelligence operating system that tracks nutrition behavior, analyzes wellness/productivity impact, generates AI recommendations, supports real-time analytics, and delivers scalable AI agent workflows.

Core Domains:

* Nutrition Intelligence
* Productivity Optimization
* AI Recommendations
* Real-Time Analytics
* Hydration Tracking
* Wellness Intelligence
* AI Agent Systems

---

# COMPLETE SYSTEM ARCHITECTURE

```plaintext
Frontend (Next.js)
       ↓
API Gateway
       ↓
FastAPI Backend
       ↓
Service Layer
       ↓
AI Agent Layer
       ↓
RAG + Vector Database
       ↓
PostgreSQL Database
       ↓
Analytics + CSV Export System
```

---

# FRONTEND TECH STACK

# FRAMEWORK

* Next.js 15
* React 19
* TypeScript

# UI SYSTEM

* Tailwind CSS
* Shadcn UI
* Framer Motion
* Lucide Icons

# STATE MANAGEMENT

* Zustand
* React Query / TanStack Query

# API COMMUNICATION

* Axios
* Fetch API

# REAL-TIME SYSTEM

* Socket.IO Client

# DATA VISUALIZATION

* Recharts

# FORM MANAGEMENT

* React Hook Form
* Zod

# AUTHENTICATION

* JWT Authentication
* Secure HTTP Cookies

# FRONTEND FEATURES

## Authentication

* Login
* Register
* Protected Routes
* Session Persistence

## Dashboard

* Nutrition Dashboard
* Real-Time Analytics
* AI Recommendation Cards
* Hydration Monitoring
* Nutrition Score

## Food Search

* Smart Search
* Filter Foods
* Food Details
* Nutrition Cards

## Nutrition Tracking

* Meal Logging
* Macro Tracking
* Hydration Tracking

## Analytics

* Macro Charts
* Nutrition Trends
* Productivity Metrics

## Real-Time Updates

* Live Dashboard Updates
* Instant Recommendation Updates
* Socket Notifications

---

# BACKEND TECH STACK

# CORE FRAMEWORK

* FastAPI
* Python 3.12+

# API SYSTEM

* REST APIs
* Async APIs
* WebSocket APIs

# AUTHENTICATION

* JWT
* OAuth2
* bcrypt / passlib

# DATABASE

* PostgreSQL

# ORM

* SQLAlchemy
* Alembic Migrations

# VALIDATION

* Pydantic V2

# REAL-TIME SYSTEM

* WebSockets
* Socket.IO

# TASK QUEUE

* Celery
* Redis

# FILE HANDLING

* Pandas
* CSV Processing

# AI SYSTEM

* LangChain
* OpenAI SDK
* Instructor
* LiteLLM

# RAG SYSTEM

* FAISS
* ChromaDB
* Sentence Transformers

# EMBEDDING MODELS

* BGE Embeddings
* OpenAI Embeddings

# LOGGING

* Loguru
* Structlog

# MONITORING

* Prometheus
* Grafana

# TESTING

* Pytest
* HTTPX
* Pytest Asyncio

# SECURITY

* CORS
* Rate Limiting
* JWT Validation
* Secure Middleware

# CONTAINERIZATION

* Docker
* Docker Compose

---

# DATABASE ARCHITECTURE

# PRIMARY DATABASE

PostgreSQL

# DATABASE FEATURES

* ACID Transactions
* Indexed Queries
* JSONB Storage
* Full-Text Search

# DATABASE TABLES

## USERS

Stores:

* user profiles
* auth credentials
* preferences

## NUTRITION_FOODS

Stores:

* master nutrition dataset
* food metadata
* image paths
* nutrition values

## NUTRITION_LOGS

Stores:

* real-time meal logs
* calorie tracking
* macro tracking

## AI_RECOMMENDATIONS

Stores:

* AI-generated recommendations
* meal suggestions
* productivity insights

## ANALYTICS

Stores:

* nutrition scores
* hydration scores
* productivity metrics

## AI_SESSIONS

Stores:

* AI interactions
* recommendation history

---

# AI AGENT ARCHITECTURE

# AGENTS

## NUTRITION AGENT

Responsibilities:

* meal recommendations
* macro analysis
* hydration suggestions

## PRODUCTIVITY AGENT

Responsibilities:

* focus optimization
* energy analysis
* productivity scoring

## ANALYTICS AGENT

Responsibilities:

* analytics generation
* trend analysis
* nutrition scoring

## PLANNER AGENT

Responsibilities:

* meal planning
* scheduling
* AI workflows

---

# AI ORCHESTRATOR

# PURPOSE

Central AI brain that:

* routes AI tasks
* manages agents
* coordinates workflows

# COMPONENTS

```plaintext
orchestrator/
├── agent_router.py
├── workflow_manager.py
├── task_dispatcher.py
└── ai_pipeline.py
```

---

# RAG ARCHITECTURE

# PURPOSE

Provides:

* semantic retrieval
* vector search
* AI memory
* contextual recommendations

# COMPONENTS

```plaintext
rag/
├── embeddings/
├── vectorstore/
├── retriever/
├── chunking/
└── indexing/
```

# VECTOR DATABASE

* ChromaDB
* FAISS

# EMBEDDINGS

* sentence-transformers
* OpenAI embeddings

---

# REAL-TIME ARCHITECTURE

# WEBSOCKET SYSTEM

Features:

* live dashboard updates
* instant AI recommendations
* hydration alerts
* analytics synchronization

# REAL-TIME EVENTS

```plaintext
nutrition_log_added
analytics_updated
recommendation_generated
hydration_alert
```

---

# WORKER ARCHITECTURE

# PURPOSE

Handles:

* background jobs
* analytics processing
* CSV exports
* AI processing

# TOOLS

* Celery
* Redis

# JOBS

```plaintext
workers/
├── celery_worker.py
├── queue_tasks.py
└── scheduled_jobs.py
```

---

# CACHE ARCHITECTURE

# CACHE SYSTEM

Redis

# USED FOR

* AI response caching
* analytics caching
* session caching
* recommendation caching

---

# MONITORING & OBSERVABILITY

# TOOLS

* Prometheus
* Grafana
* Loguru
* Structlog

# FEATURES

* API monitoring
* AI latency tracking
* database monitoring
* error tracing
* request tracing

---

# SECURITY ARCHITECTURE

# FEATURES

## AUTH SECURITY

* JWT
* OAuth2
* bcrypt hashing

## API SECURITY

* rate limiting
* CORS protection
* request validation
* secure middleware

## DATA SECURITY

* encrypted secrets
* environment variables
* protected endpoints

---

# TESTING ARCHITECTURE

# TOOLS

* Pytest
* HTTPX
* Pytest Asyncio

# TEST TYPES

## API TESTS

* auth tests
* nutrition APIs
* analytics APIs

## DATABASE TESTS

* schema validation
* migrations
* query testing

## AI TESTS

* recommendation validation
* prompt validation
* response consistency

## WEBSOCKET TESTS

* real-time event testing
* reconnect testing

---

# DEPLOYMENT ARCHITECTURE

# FRONTEND DEPLOYMENT

* Vercel

# BACKEND DEPLOYMENT

* Railway
* Render
* AWS ECS

# DATABASE HOSTING

* Neon PostgreSQL
* Supabase PostgreSQL

# VECTOR DATABASE

* ChromaDB
* Pinecone (optional)

# STORAGE

* AWS S3
* Cloudinary

---

# REQUIRED ENVIRONMENT VARIABLES

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

# DATASET ARCHITECTURE

# DATASET LOCATION

```plaintext
E:\dhanraj\AI productivity agent\dataset\nutrition_project
```

# DATASET FILES

```plaintext
nutrition_dataset.csv
nutrition_dataset_with_images.csv
nutrition_images/
exports/
```

---

# CSV EXPORT ARCHITECTURE

# EXPORT FILES

```plaintext
nutrition_logs.csv
analytics.csv
ai_recommendations.csv
```

# EXPORT PURPOSE

* AI training
* analytics pipelines
* monitoring
* reporting

---

# FINAL PRODUCTION GOAL

The final system should behave like:

“A production-grade AI nutrition productivity operating system that combines real-time nutrition tracking, AI agent orchestration, RAG retrieval systems, analytics intelligence, vector memory, scalable backend infrastructure, and modern frontend UX to deliver personalized wellness, focus, hydration, and productivity optimization.”
