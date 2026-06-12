# NUTRI AI Deployment Report

## 1. Project Architecture

NUTRI AI is currently a two-application project:

- `frontend/`: React 19 + TypeScript + Tailwind CSS app built with Vite.
- `backend/`: FastAPI backend with SQLAlchemy, JWT auth, RAG endpoints, WebSockets, Redis cache integration, and Celery worker configuration.
- `dataset/nutrition_project/`: Real nutrition dataset mounted into backend containers.

Important note: the actual frontend is Vite, not Next.js. The Docker architecture uses the real project files instead of forcing a Next.js runtime that does not exist in this codebase.

## 2. Service Architecture

`docker-compose.yml` starts:

- `postgres`: PostgreSQL 16 database.
- `redis`: Redis 7 cache and Celery broker.
- `backend`: FastAPI app on port `8000`.
- `celery-worker`: Celery worker connected to Redis and PostgreSQL.
- `celery-beat`: Celery scheduler process for future scheduled jobs.
- `frontend`: Vite production build served by Nginx on port `5173`.

Startup order:

```text
PostgreSQL healthcheck
Redis healthcheck
Backend healthcheck
Celery worker / Celery beat
Frontend
```

## 3. Startup Command

From the project root:

```powershell
docker compose up --build
```

Windows helper:

```powershell
.\run-project.ps1
```

or:

```bat
run-project.bat
```

## 4. Shutdown Command

```powershell
docker compose down
```

Windows helper:

```bat
stop-project.bat
```

To remove volumes too:

```powershell
docker compose down -v
```

## 5. Environment Variables

Copy `.env.docker.example` to `.env` if you want to override defaults.

Required/important variables:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=nutrition_agent
POSTGRES_PORT=5432
REDIS_PORT=6379
BACKEND_PORT=8000
FRONTEND_PORT=5173
JWT_SECRET=change-this-dev-secret
JWT_EXPIRE_MINUTES=1440
OPENAI_API_KEY=
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_WS_BASE_URL=ws://127.0.0.1:8000
```

Inside Docker, the backend receives:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/nutrition_agent
REDIS_URL=redis://redis:6379/0
DATASET_ROOT=/datasets/nutrition_project
EXPORTS_ROOT=/datasets/nutrition_project/exports
```

## 6. Ports Used

| Service | Host Port | Container Port | URL |
| --- | ---: | ---: | --- |
| Frontend | `5173` | `80` | `http://127.0.0.1:5173` |
| Backend | `8000` | `8000` | `http://127.0.0.1:8000` |
| Swagger | `8000` | `8000` | `http://127.0.0.1:8000/docs` |
| PostgreSQL | `5432` | `5432` | internal: `postgres:5432` |
| Redis | `6379` | `6379` | internal: `redis:6379` |

## 7. Generated Files

Docker files:

- `docker-compose.yml`
- `backend/docker/Dockerfile`
- `backend/.dockerignore`
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `frontend/.dockerignore`
- `.env.docker.example`

Helper scripts:

- `run-project.bat`
- `run-project.ps1`
- `stop-project.bat`

## 8. Verification Performed

Local verification completed:

- Frontend build passed with `npm run build`.
- Backend import passed with `from app.main import app`.
- PostgreSQL sync dependency added: `psycopg2-binary`.
- Frontend WebSocket base URL is now configurable through `VITE_WS_BASE_URL`.
- Celery app now includes task discovery for `app.workers.queue_tasks`.

Docker verification limitation:

- Docker is not installed or not available in the current shell, so `docker compose config` and `docker compose up --build` could not be executed here.

Once Docker Desktop is installed and running, verify with:

```powershell
docker compose config
docker compose up --build
```

Then check:

```text
http://127.0.0.1:5173
http://127.0.0.1:8000/health
http://127.0.0.1:8000/docs
http://127.0.0.1:8000/cache-health
http://127.0.0.1:8000/worker-health
```

## 9. Troubleshooting

### Docker command not found

Install Docker Desktop for Windows and restart the terminal.

Check:

```powershell
docker --version
docker compose version
```

### Port already in use

Stop local dev servers or change ports in `.env`.

```powershell
docker compose down
```

Default ports:

- Backend: `8000`
- Frontend: `5173`
- PostgreSQL: `5432`
- Redis: `6379`

### Backend cannot connect to PostgreSQL

Check container health:

```powershell
docker compose ps
docker compose logs postgres
docker compose logs backend
```

Confirm the backend uses Docker service DNS:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/nutrition_agent
```

Do not use `localhost` inside backend containers for PostgreSQL.

### Frontend cannot reach backend

For local browser access, frontend build args default to:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_WS_BASE_URL=ws://127.0.0.1:8000
```

If deploying to another host, change these values in `.env` and rebuild:

```powershell
docker compose up --build
```

### Redis unavailable

The backend has memory fallback, but the Docker stack includes Redis. Check:

```powershell
docker compose logs redis
docker compose logs backend
```

### Celery worker not processing tasks

Check:

```powershell
docker compose logs celery-worker
docker compose logs celery-beat
```

The worker command is:

```text
celery -A app.workers.celery_worker:celery_app worker --loglevel=info --pool=solo -Q nutrition
```

### AI/OpenAI not active

Set:

```env
OPENAI_API_KEY=your_key_here
```

Then rebuild/restart:

```powershell
docker compose up --build
```

Without this key, the backend should continue using local RAG fallback behavior.

## 10. Final Startup Goal

After Docker Desktop is installed and running, the full project should start with:

```powershell
docker compose up --build
```

This starts PostgreSQL, Redis, FastAPI, Celery worker, Celery beat, the frontend, and WebSocket-capable backend services with one command.
