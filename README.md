
# 🎨 Sketch Space

**Sketch Space** is a collaborative whiteboard app inspired by Excalidraw, designed for teams and individuals to sketch, brainstorm, and collaborate in real-time.



## ✨ Features

- 🖊️ Freehand drawing, shapes, and text  
- 🧠 Real-time collaboration via WebSockets  
- 💾 Save and load sketches locally  
- 🔗 Share boards with unique URLs  
- 🌙 Light/Dark mode toggle  
- ⚙️ Built with TypeScript, React, and Tailwind CSS  

## 🚀 Tech Stack

- **Frontend**: React + Vite + TypeScript  
- **Styling**: Tailwind CSS  
- **Realtime**: Socket.IO (WebSockets)  
- **Backend**: Node.js + Express  
- **Others**: Zustand (state management), Prettier, ESLint  

## 📦 Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/AbhinavOC24/Sketch-Space.git
cd Sketch-Space
```


Make sure you have npm installed.

### 2. Start the development servers
Start WebSocket server
```bash
cd ws-backend
npm install
npm run dev
```
Start http-server
```bash
cd http-server
npm install
npm run dev

```


Start Frontend:
```bash
cd ex-front
npm install
npm run dev
```
Frontend runs on http://localhost:5173, backend runs on http://localhost:3000 and (WebSocket) runs on http://localhost:8081.

🛠️ Project Structure
```bash

Sketch-Space/
├── ex-front/       → Frontend app (React + Vite)
├── http-backend/     → http backend (Node + Express)
├── ws-backend/     → WebSocket backend (Websocket)
├── .github/        → GitHub actions/workflows (CI/CD)
└── README.md       → Project documentation
```


🧠 Future Plans
✍️ Drawing history & undo/redo

📁 Cloud sketch storage (MongoDB integration)

🔐 Authentication & user sessions

📞 Voice/video collaboration via WebRTC

📱 Mobile responsive view

🤝 Contributing
Feel free to fork and submit a PR! Contributions are welcome.

# Make a new branch
```bash
git checkout -b feature/your-feature-name
```
# Make your changes
# Then push and submit a PR

📄 License
This project is licensed under the MIT License.

🙋‍♂️ Author
@AbhinavOC24
