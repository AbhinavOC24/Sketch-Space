# 🎨 Sketch Space

**Sketch Space** is a collaborative whiteboard app inspired by Excalidraw, designed for teams and individuals to sketch, brainstorm, and collaborate in real-time.

## ✨ Features

- 🖊️ Freehand drawing, shapes, and text  
- 🧠 Real-time collaboration via WebSockets  
- 💾 Save and load sketches locally  
- 🔗 Share boards with unique URLs  
- 🌙 Light/Dark mode toggle  
- ⚙️ Built with Next.js, TypeScript, and Tailwind CSS  

## 🚀 Tech Stack

- **Frontend**: Next.js (React) + TypeScript  
- **Styling**: Tailwind CSS  
- **Realtime**: WebSockets (`ws` package)  
- **Backend**: Node.js + Express + Prisma (PostgreSQL)  
- **Others**: Zustand (state management), ESLint  

## 📦 Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/AbhinavOC24/Sketch-Space.git
cd Sketch-Space
```

Make sure you have npm and Docker installed.

### 2. Configure Environment Variables

Create a `.env` file in the root of the following directories based on the required variables:

**`http-backend/.env`**:
```env
DATABASE_URL="postgresql://postgres:password@127.0.0.1:5433/sketchspace"
JWTSECRET="your_jwt_secret_here"
FRONTEND_URL="http://localhost:3000"
```

**`ws-backend/.env`**:
```env
JWTSECRET="your_jwt_secret_here"
```

**`frontend/.env.local`**:
```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"
NEXT_PUBLIC_WEBSOCKET_URL="ws://localhost:8081"
```

### 3. Start the Database
Run the local PostgreSQL database using Docker:
```bash
docker-compose up -d
```

### 4. Start the development servers

**Database Migrations** (in `http-backend`):
```bash
cd http-backend
npm install
npx prisma migrate dev
```

**Start HTTP Backend**:
```bash
# From http-backend
npm run dev
```

**Start WebSocket Backend**:
```bash
cd ws-backend
npm install
npm run dev
```

**Start Frontend**:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000, HTTP backend runs on http://localhost:3001 and WebSocket runs on http://localhost:8081.

## 🛠️ Project Structure
```bash
Sketch-Space/
├── frontend/       → Next.js Frontend app
├── http-backend/   → Express REST API (Auth, Rooms, etc.)
├── ws-backend/     → WebSocket Server for real-time collaboration
└── README.md       → Project documentation
```

## 🤝 Contributing
Feel free to fork and submit a PR! Contributions are welcome.

## 📄 License
This project is licensed under the MIT License.

## 🙋‍♂️ Author
@AbhinavOC24
