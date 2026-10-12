# ⚽ ShuffleXI — Full-Stack MERN Football Squad Builder

A full-stack football squad-building web application built with the **MERN** stack (MongoDB, Express, React, Node.js), Vite, and Docker.

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" />
</p>

---

## 🌟 Features

- **Single-Command Launch**: Run `cd frontend && npm run dev` to start both the Vite frontend and the Express backend simultaneously.
- **League & Club Exploration**: Browse through major football leagues, drill down into clubs, and inspect full rosters.
- **Detailed Player Cards**: 6 core performance attributes (Pace, Shooting, Passing, Dribbling, Defending, Physical) mapped with visual stat bars and tier badges.
- **Tactical 4-3-3 Pitch**: Interactive football pitch with 11 tactical slots (1 GK, 4 DEF, 3 MID, 3 ATK).
- **Position-fit System**: Enforces tactical roles, applying an automatic **-3 OVR penalty** to out-of-position players.
- **Dynamic Team Rating**: Calculates chemistry based on weighted formulas:
  - **Goalkeeper**: 10%
  - **Defense**: 30%
  - **Midfield**: 30%
  - **Attack**: 30%
- **REST API Verification**: Synchronize and verify client-calculated squad ratings against the Express backend calculation endpoint.
- **Persistent Squad**: Saves your drafted 11 in `localStorage` across page refreshes.

---

## 🏗️ Architecture

```
football-game/
├── package.json                   # Root orchestrator
├── .env.example                   # Environment template
├── .gitignore                     # Excludes node_modules, .env, dist
├── README.md                      # Overview & quickstart
├── TECHNICAL_PLAN.md              # In-depth architectural & technical specification
│
└── frontend/                      # Main Workspace
    ├── index.html                 # HTML shell (Outfit & Inter fonts)
    ├── vite.config.js             # Vite dev server + proxy to port 5000
    ├── package.json               # Frontend dependencies + combined scripts
    ├── src/
    │   ├── main.jsx               # Entry point
    │   ├── App.jsx                # Router & layout
    │   ├── index.css              # Global design system & theme tokens
    │   ├── api/axiosClient.js     # Axios API client
    │   ├── context/SquadContext.jsx # Squad state & chemistry math
    │   ├── components/            # UI components (Pitch, Slots, Cards, Nav)
    │   └── pages/                 # Full pages (Home, Leagues, Clubs, Roster, Squad)
    │
    └── backend/                   # Backend API (Node.js + Express)
        ├── server.js              # Express app entry & listener
        ├── package.json           # Express, Mongoose, Dotenv, Cors
        ├── .env                   # Local secrets (PORT=5000, MONGO_URI)
        ├── config/db.js           # MongoDB connection handler
        ├── middleware/            # Error handling & 404 middleware
        ├── models/                # Mongoose schemas (League, Club, Player)
        ├── routes/                # REST routes (/api/leagues, /api/clubs, /api/players, /api/squad)
        ├── controllers/           # Controllers handling business logic
        ├── utils/                 # Team rating calculation engine
        └── seed/seed.js           # Database seeder (48 players, 6 clubs, 2 leagues)
```

---

---

## 🚀 Getting Started

### 1. Prerequisites
- [Docker & Docker Compose](https://www.docker.com/) (Recommended for instant, zero-config reproducibility)
- *OR* [Node.js](https://nodejs.org/) (v18+) and [MongoDB](https://www.mongodb.com/) (v7+) locally

---

### 🐳 Option A: Run with Docker (Recommended)

Spins up MongoDB, Express backend, and React/Vite frontend with live code reloading across all platforms.

```bash
# 1. Build and start all containers in the background (or foreground)
npm run docker:up:build
# or directly with Docker Compose:
docker compose up --build

# 2. Seed database with all 5 European leagues & squads (runs once)
npm run docker:seed
# or:
docker compose run --rm backend npm run seed
```

- **Frontend (Vite + React):** [http://localhost:3000](http://localhost:3000)
- **Backend API (Express):** [http://localhost:5000](http://localhost:5000)
- **MongoDB:** `localhost:27017`

#### Useful Docker Commands (Root Directory)
```bash
# Start containers in background
npm run docker:up:d

# View live service logs
npm run docker:logs

# Stop containers (preserves database data volume)
npm run docker:down

# Stop containers and reset database volume
npm run docker:down:v

# Production build test with Nginx & optimized assets
npm run docker:prod:up
```

---

### 💻 Option B: Run Locally Without Docker

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Start BOTH Vite frontend and Express backend concurrently
npm run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

#### Other Useful Local Commands (Inside `frontend/`)
```bash
# Re-seed local MongoDB database
npm run seed:all

# Run ONLY backend
npm run dev:backend

# Run ONLY frontend
npm run dev:frontend

# Build frontend for production
npm run build
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/leagues` | Get all leagues |
| `GET` | `/api/leagues/:id` | Get single league |
| `GET` | `/api/clubs` | Get all clubs (optional `?league=id`) |
| `GET` | `/api/clubs/:id` | Get single club |
| `GET` | `/api/players` | Get players (optional `?club=id&league=id&position=pos`) |
| `GET` | `/api/players/:id` | Get single player details |
| `POST` | `/api/squad/rating` | Calculate team rating for 11 player IDs |

---

## 📖 Documentation & Guides

- **[BEGINNER_GUIDE.md](file:///c:/Users/asus/OneDrive/Desktop/Project/football-game/BEGINNER_GUIDE.md)**: 👶 **Start Here!** A complete, baby-step explanation of every file (`.gitignore`, `package.json`, `.env.example`), technology, how MongoDB and React work, and every single API endpoint step-by-step.
- **[TECHNICAL_PLAN.md](file:///c:/Users/asus/OneDrive/Desktop/Project/football-game/TECHNICAL_PLAN.md)**: In-depth engineering architectural specification, relational schemas, sequence diagrams, and mathematical formulation.
