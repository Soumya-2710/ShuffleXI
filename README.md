# ⚽ Football Game — MERN Squad Builder

A full-stack football squad-building web application built with the **MERN** stack (MongoDB, Express, React, Node.js) and Vite.

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

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (or Docker)

### 2. Run Everything in One Command!
```bash
# Navigate to frontend
cd frontend

# Start BOTH Vite frontend and Express backend together
npm run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

### 3. Other Useful Commands (Inside `frontend/`)
```bash
# Re-seed the database with 48 players
npm run seed

# Run ONLY the backend
npm run backend

# Run ONLY the frontend
npm run dev:frontend

# Build for production
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
