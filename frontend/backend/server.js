const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route imports
const leagueRoutes = require('./routes/leagueRoutes');
const clubRoutes = require('./routes/clubRoutes');
const playerRoutes = require('./routes/playerRoutes');
const squadRoutes = require('./routes/squadRoutes');

const path = require('path');

// Load env vars from current directory (.env)
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/leagues', leagueRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/squad', squadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Football Game API is running' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
