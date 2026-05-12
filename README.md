# SketchSpace

**SketchSpace** is a premium, real-time collaborative whiteboarding tool built for designers, developers, and creative teams. It features a high-performance drawing engine with glassmorphism aesthetics and instant synchronization across all participants.

![SketchSpace Preview](https://github.com/AbhinavOC24/Sketch-Space/raw/master/preview.png)

## Features

- **Precision Drawing**: Smooth, anti-aliased strokes for pencil, shapes, and arrows.
- **Live Collaboration**: See your teammates' cursors and updates in real-time with zero lag.
- **Glassmorphism UI**: A sleek, dark-themed interface built with Tailwind CSS.
- **Production Ready**: Automated CI/CD pipeline with zero-downtime deploys.

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Backend (REST)**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Prisma ORM](https://www.prisma.io/)
- **Backend (Real-time)**: [WebSockets (ws)](https://github.com/websockets/ws)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **Infrastructure**: [Render](https://render.com/) (backends), [Vercel](https://vercel.com/) (frontend), [GitHub Actions](https://github.com/features/actions)

---

## Local Development

### 1. Prerequisites
- Node.js (v20+)
- Docker (for the local database)

### 2. Clone the Repository
```bash
git clone https://github.com/AbhinavOC24/Sketch-Space.git
cd Sketch-Space
```

### 3. Setup the Database
Start the local PostgreSQL container:
```bash
docker compose up -d
```

### 4. Configure Environment Variables
Create `.env` files in each service directory:

#### `http-backend/.env`
```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/sketchspace"
JWTSECRET="your_jwt_secret"
FRONTEND_URL="http://localhost:3000"
```

#### `ws-backend/.env`
```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/sketchspace"
JWTSECRET="your_jwt_secret"
```

#### `frontend/.env`
```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:8001"
NEXT_PUBLIC_WEBSOCKET_URL="ws://localhost:8002"
```

### 5. Install & Run
Run these in separate terminals:

**HTTP Backend:**
```bash
cd http-backend
npm install
npx prisma generate
npm run dev
```

**WebSocket Backend:**
```bash
cd ws-backend
npm install
npx prisma generate
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Production Deployment

> **Note:** This project was originally hosted on AWS EC2. After exhausting the free tier, it was migrated to a fully free stack: **Render** (backends) + **Vercel** (frontend) + **Supabase** (database).

### Architecture

```
Vercel (Next.js frontend)
  ├── REST  →  https://sketchspace-http.onrender.com
  └── WS    →  wss://sketchspace-ws.onrender.com
                    ↕ both
             Supabase (PostgreSQL)
```

### GitHub Secrets
Add the following secrets to your GitHub repository to enable the CI/CD pipeline:

| Secret | Description |
|---|---|
| `RENDER_HTTP_DEPLOY_HOOK` | Deploy hook URL for the `sketchspace-http` Render service |
| `RENDER_WS_DEPLOY_HOOK` | Deploy hook URL for the `sketchspace-ws` Render service |
| `NEXT_PUBLIC_BACKEND_URL` | e.g. `https://sketchspace-http.onrender.com` |
| `NEXT_PUBLIC_WEBSOCKET_URL` | e.g. `wss://sketchspace-ws.onrender.com` |

### Render Environment Variables
Set these in each service's **Environment** tab on the Render dashboard:

**`sketchspace-http`**
- `DATABASE_URL` — Supabase connection string
- `JWTSECRET` — secure random secret
- `FRONTEND_URL` — your Vercel deployment URL

**`sketchspace-ws`**
- `DATABASE_URL` — same Supabase connection string
- `JWTSECRET` — **same secret** as the HTTP backend

### Vercel Environment Variables
Set these in the Vercel project dashboard under **Settings → Environment Variables**:
- `NEXT_PUBLIC_BACKEND_URL` — Render HTTP service URL
- `NEXT_PUBLIC_WEBSOCKET_URL` — Render WS service URL (use `wss://`)

---

## License
This project is licensed under the MIT License.
