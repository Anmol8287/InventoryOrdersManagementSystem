# Inventory & Order Management System

Production-ready full stack inventory and order management app built with React, FastAPI, SQLAlchemy, PostgreSQL, Docker, TailwindCSS, React Icons, and Recharts.

---

## 🚀 Live Demo

| Component | Link |
|-----------|------|
| 🌐 Frontend (Vercel) | [inventory-orders-management-system.vercel.app](https://inventory-orders-management-system.vercel.app/) |
| ⚙️ Backend API (Render) | [inventoryordersmanagementsystem.onrender.com](https://inventoryordersmanagementsystem.onrender.com) |
| 📖 API Docs | [inventoryordersmanagementsystem.onrender.com/docs](https://inventoryordersmanagementsystem.onrender.com/docs) |

---

## 📁 Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entrypoint
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── routers/         # Product, customer, order routers
│   │   └── database.py      # DB connection and session
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   ├── pages/           # Dashboard, Products, Customers, Orders
│   │   └── main.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## Features

- Product CRUD with unique SKU validation, search, pagination, modals, loading and empty states.
- Customer create/list/delete with unique email validation and search.
- Order creation with customer selection, multiple products, quantity selection, backend total calculation, stock deduction, insufficient-stock protection, and rollback on failure.
- Dashboard summary cards, low-stock table, recent orders, and inventory distribution chart.
- Global backend exception handling and frontend toast notifications.
- Docker Compose stack for frontend, backend, and PostgreSQL.

---

## Run Locally With Docker

```bash
cp .env.example .env
docker-compose up --build
```

| Service      | URL                         |
|--------------|-----------------------------|
| Frontend     | http://localhost:3000       |
| Backend API  | http://localhost:8000       |
| API Docs     | http://localhost:8000/docs  |

---

## Backend (Without Docker)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

> Set `DATABASE_URL` to a running PostgreSQL database. Tables are created automatically on startup.

---

## Frontend (Without Docker)

```bash
cd frontend
npm install
npm run dev
```

> Set `VITE_API_URL` when the API is not running on `http://localhost:8000`.

---

## API Endpoints

### Products

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| POST   | `/products`        | Create a product   |
| GET    | `/products`        | List all products  |
| GET    | `/products/{id}`   | Get product by ID  |
| PUT    | `/products/{id}`   | Update a product   |
| DELETE | `/products/{id}`   | Delete a product   |

### Customers

| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| POST   | `/customers`        | Create a customer   |
| GET    | `/customers`        | List all customers  |
| GET    | `/customers/{id}`   | Get customer by ID  |
| DELETE | `/customers/{id}`   | Delete a customer   |

### Orders

| Method | Endpoint         | Description      |
|--------|------------------|------------------|
| POST   | `/orders`        | Create an order  |
| GET    | `/orders`        | List all orders  |
| GET    | `/orders/{id}`   | Get order by ID  |
| DELETE | `/orders/{id}`   | Delete an order  |

---

## Deployment Guide

### PostgreSQL

Create a managed PostgreSQL database on [Render](https://render.com), [Neon](https://neon.tech), [Supabase](https://supabase.com), or another provider. Copy the external connection string and use it as `DATABASE_URL`.

### Backend on Render

1. Create a new Web Service from this repository.
2. Set root directory to `backend`.
3. Use Docker deployment.
4. Add environment variables:

   | Variable       | Value                                          |
   |----------------|------------------------------------------------|
   | `DATABASE_URL` | Your PostgreSQL connection string              |
   | `CORS_ORIGINS` | `https://inventory-orders-management-system.vercel.app` |
   | `ENVIRONMENT`  | `production`                                   |

5. Deploy and confirm `/health` returns `{ "status": "ok" }`.

### Frontend on Vercel

1. Import the repository in Vercel.
2. Set root directory to `frontend`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add environment variable:

   | Variable       | Value                                                    |
   |----------------|----------------------------------------------------------|
   | `VITE_API_URL` | `https://inventoryordersmanagementsystem.onrender.com`   |

6. Deploy.

---

## Docker Images

Pre-built images are available on Docker Hub for quick deployment without building from source.

### Pull & Run

**Backend**
```bash
docker pull docker.io/anmol8287/inventory-backend:latest
docker run -p 8000:8000 \
  -e DATABASE_URL=<your_db_url> \
  -e CORS_ORIGINS=<your_frontend_url> \
  anmol8287/inventory-backend:latest
```

**Frontend**
```bash
docker pull docker.io/anmol8287/inventory-frontend:latest
docker run -p 3000:3000 \
  -e VITE_API_URL=<your_backend_url> \
  anmol8287/inventory-frontend:latest
```

### Image References

| Service  | Image                                           |
|----------|-------------------------------------------------|
| Backend  | `docker.io/anmol8287/inventory-backend:latest`  |
| Frontend | `docker.io/anmol8287/inventory-frontend:latest` |

### Docker Hub Pages

- Backend: https://hub.docker.com/r/anmol8287/inventory-backend
- Frontend: https://hub.docker.com/r/anmol8287/inventory-frontend

---

## Production Notes

- Add Alembic migrations before long-term production use.
- Use strong database credentials and provider-managed backups.
- Restrict `CORS_ORIGINS` to deployed frontend domains.
- Add authentication and role-based authorization for real business deployments.
