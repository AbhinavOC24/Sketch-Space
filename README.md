# SketchSpace

**SketchSpace** is a premium, real-time collaborative whiteboarding tool built for designers, developers, and creative teams. It features a high-performance drawing engine with glassmorphism aesthetics and instant synchronization across all participants.

![SketchSpace Preview](https://github.com/AbhinavOC24/Sketch-Space/raw/master/preview.png)

## Features

- **Precision Drawing**: Smooth, anti-aliased strokes for pencil, shapes, and arrows.
- **Live Collaboration**: See your teammates' cursors and updates in real-time with zero lag.
- **Glassmorphism UI**: A sleek, dark-themed interface built with Tailwind CSS.
- **Production Ready**: Fully Dockerized with an automated CI/CD pipeline.

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Backend (REST)**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Prisma ORM](https://www.prisma.io/)
- **Backend (Real-time)**: [WebSockets (ws)](https://github.com/websockets/ws)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Infrastructure**: [Docker](https://www.docker.com/), [Nginx](https://www.nginx.com/), [GitHub Actions](https://github.com/features/actions)

---

## Local Development

### 1. Prerequisites
- Node.js (v20+)
- Docker (for the database)

### 2. Clone the Repository
```bash
git clone https://github.com/AbhinavOC24/Sketch-Space.git
cd Sketch-Space
```

### 3. Setup the Database
Start the PostgreSQL container:
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
NEXT_PUBLIC_WS_URL="ws://localhost:8002"
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

### GitHub Secrets
To use the built-in CI/CD pipeline, add the following secrets to your GitHub repository:

- `EC2_HOST`: Your server IP.
- `EC2_USER`: `ubuntu`
- `EC2_SSH_KEY`: Your `.pem` private key content.
- `DB_USER`: Database username.
- `DB_PASSWORD`: Database password.
- `JWT_SECRET`: Secure secret for authentication.

### Nginx Configuration
The project is designed to run on a standalone domain (e.g., `sketchspace.duckdns.org`). See the deployment logs for the specific Nginx `server` block configuration.

---

## License
This project is licensed under the MIT License.
