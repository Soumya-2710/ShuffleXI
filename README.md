# ⚽ Football Game — MERN Squad Builder

A full-stack football squad-building web application built with the **MERN** stack (MongoDB, Express, React, Node.js) and Vite.

---

## 🌟 Features

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

---

## 🏗️ Architecture

```
football-game/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/            # Axios API client
│   │   ├── components/     # Navbar, PlayerCard, FormationPitch, SquadSlot, TeamRating, etc.
│   │   ├── context/        # SquadContext (squad state, rating engine)
│   │   ├── pages/          # Home, Leagues, Clubs, Players, PlayerDetail, SquadBuilder
│   │   ├── App.jsx
│   │   └── index.css       # Global design system & theme tokens
│   └── vite.config.js      # Vite dev server + proxy to Express
│
├── server/                 # Node.js + Express backend
│   ├── config/             # MongoDB connection (Mongoose)
│   ├── controllers/        # League, Club, and Player controllers
│   ├── models/             # Mongoose schemas (League, Club, Player)
│   ├── routes/             # REST routes (/api/leagues, /api/clubs, /api/players, /api/squad)
│   ├── seed/               # Database seeder (2 leagues, 6 clubs, 48 players)
│   ├── utils/              # Team rating calculator logic
│   └── server.js           # Server entry point
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (or Docker)

### 2. Environment Variables
Create a `.env` file in `server/` (or copy `.env.example`):
```env
MONGO_URI=mongodb://localhost:27017/football-game
PORT=5000
NODE_ENV=development
```

### 3. Install & Seed
```bash
# Seed the database
cd server
npm run seed

# Run the backend (port 5000)
npm run dev
```

In a separate terminal:
```bash
# Run the frontend (port 3000)
cd client
npm run dev
```

Visit **http://localhost:3000** in your browser.

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
