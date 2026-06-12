# AI Nutrition Productivity Agent Backend (FastAPI)

## Run

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## API Base

- `GET /health`
- `POST /api/register`
- `POST /api/login`
- `GET /api/profile`
- `GET /api/foods`
- `POST /api/nutrition-log`
- `GET /api/recommendations`
- `GET /api/analytics`
- `POST /api/exports`
- `WS /api/ws`

## Dataset

Default root:
`E:\dhanraj\AI productivity agent\dataset\nutrition_project`

CSV bootstrap runs automatically on startup.
