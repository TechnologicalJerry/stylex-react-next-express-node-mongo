# Express Server Boilerplate

Express + TypeScript microservices-oriented starter with:

- 11 service modules (`auth`, `users`, `tickets`, `billing`, `payments`, `notifications`, `analytics`, `inventory`, `search`, `reports`, `sla`)
- MongoDB support via `mongoose`
- MySQL support via `mysql2`
- PostgreSQL support via `pg`
- Swagger docs at `/docs`
- Linting and tests with ESLint + Vitest

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Server default URL: `http://localhost:4000`

## Endpoints

- `GET /health` basic server health
- `GET /services` list all microservice routes
- `GET /docs` Swagger UI
- `GET /api/<service>/health` service-level health

## Scripts

- `npm run dev` start in watch mode
- `npm run build` build to `dist`
- `npm run start` run built app
- `npm run lint` run ESLint
- `npm run test` run unit tests