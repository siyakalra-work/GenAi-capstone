# StockPilot — Inventory Intelligence Platform

AI-powered Multi-Tenant Inventory Management System (SaaS) built with FastAPI + React.

## Repo

- GitHub: `siyakalra-work/GenAi-capstone`

## Quickstart (Docker)

1. Copy env files (edit secrets for real deployments):
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
2. Start everything:
   - `docker compose up --build`
3. Run migrations:
   - `docker compose exec backend alembic upgrade head`
4. Seed demo data:
   - `docker compose exec backend python -m app.scripts.seed`

Frontend: `http://localhost:5173`

Backend API: `http://localhost:8000/api`

## Auth + Tenant model

- Super Admin: `tenant_id = null`
- Tenant users: `tenant_id = <tenant uuid>`
- Frontend sets `X-Tenant-ID` header from Settings, and uses `Authorization: Bearer <access_token>`.

## API Endpoints (core)

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/auth/profile`
- Tenants (super admin): `GET/POST/PUT/DELETE /api/tenants`
- Products: `GET/POST/GET/PUT/DELETE /api/products`
- Inventory: `GET /api/inventory/transactions`, `POST /api/inventory/stock-in`, `POST /api/inventory/stock-out`, `POST /api/inventory/adjustment`
- AI: `POST /api/ai/chat`, `POST /api/ai/search`, `POST /api/ai/summary`, `POST /api/ai/upload-document`, `POST /api/ai/ask-document`, `POST /api/ai/extract-invoice`

## Notes on AI features

This repo includes a provider abstraction in `backend/app/services/ai/provider.py`.

- Default behavior is a safe, no-network fallback message.
- For real OpenAI integration: wire `LLMProvider.chat()` to the OpenAI Responses API and set `OPENAI_API_KEY`.

RAG storage is stubbed behind `backend/app/services/rag/qdrant_client.py` and uses per-tenant collection names.

