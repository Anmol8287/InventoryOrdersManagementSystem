# Inventory & Order Management System

Production-ready full stack inventory and order management app built with React, FastAPI, SQLAlchemy, PostgreSQL, Docker, TailwindCSS, React Icons, and Recharts.

## Features

- Product CRUD with unique SKU validation, search, pagination, modals, loading and empty states.
- Customer create/list/delete with unique email validation and search.
- Order creation with customer selection, multiple products, quantity selection, backend total calculation, stock deduction, insufficient-stock protection, and rollback on failure.
- Dashboard summary cards, low-stock table, recent orders, and inventory distribution chart.
- Global backend exception handling and frontend toast notifications.
- Docker Compose stack for frontend, backend, and PostgreSQL.

## Run Locally With Docker

```bash
cp .env.example .env
docker-compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Set `DATABASE_URL` to a running PostgreSQL database. Tables are created automatically on startup.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` when the API is not running on `http://localhost:8000`.

## API Endpoints

Products:

- `POST /products`
- `GET /products`
- `GET /products/{id}`
- `PUT /products/{id}`
- `DELETE /products/{id}`

Customers:

- `POST /customers`
- `GET /customers`
- `GET /customers/{id}`
- `DELETE /customers/{id}`

Orders:

- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `DELETE /orders/{id}`

## Deployment Guide

### PostgreSQL

Create a managed PostgreSQL database on Render, Neon, Supabase, or another provider. Copy the external connection string and use it as `DATABASE_URL`.

### Backend on Render

1. Create a new Web Service from this repository.
2. Set root directory to `backend`.
3. Use Docker deployment.
4. Add environment variables:
   - `DATABASE_URL`
   - `CORS_ORIGINS=https://your-vercel-app.vercel.app`
   - `ENVIRONMENT=production`
5. Deploy and confirm `/health` returns `{ "status": "ok" }`.

### Frontend on Vercel

1. Import the repository in Vercel.
2. Set root directory to `frontend`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add environment variable:
   - `VITE_API_URL=https://your-render-backend.onrender.com`
6. Deploy.

## Production Notes

- Add Alembic migrations before long-term production use.
- Use strong database credentials and provider-managed backups.
- Restrict `CORS_ORIGINS` to deployed frontend domains.
- Add authentication and role-based authorization for real business deployments.
