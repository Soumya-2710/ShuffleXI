const Player = require('../models/Player');
const { calculateTeamRating } = require('../utils/ratingCalculator');

// @desc    Get all players (optional ?club=id&league=id&position=X filters)
// @route   GET /api/players
// @access  Public
const getPlayers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.club) filter.club = req.query.club;
    if (req.query.league) filter.league = req.query.league;
    if (req.query.position) filter.position = req.query.position.toUpperCase();

    const players = await Player.find(filter)
      .populate('club', 'name')
      .populate('league', 'name')
      .sort({ overall: -1 });

    res.json({ success: true, count: players.length, data: players });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single player by ID
// @route   GET /api/players/:id
// @access  Public
const getPlayerById = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate('club', 'name logo')
      .populate('league', 'name country');

    if (!player) {
      res.status(404);
      throw new Error('Player not found');
    }

    res.json({ success: true, data: player });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate team rating from 11 player IDs + slot assignments
// @route   POST /api/squad/rating
// @access  Public
const calculateSquadRating = async (req, res, next) => {
  try {
    const { squad } = req.body;

    if (!squad || !Array.isArray(squad) || squad.length !== 11) {
      res.status(400);
      throw new Error('Squad must contain exactly 11 players with slot assignments');
    }

    // Validate all entries have playerId and slotIndex
    for (const entry of squad) {
      if (!entry.playerId || entry.slotIndex === undefined) {
        res.status(400);
        throw new Error('Each squad entry must have playerId and slotIndex');
      }
    }

    // Fetch all players
    const playerIds = squad.map((s) => s.playerId);
    const players = await Player.find({ _id: { $in: playerIds } });

    if (players.length !== 11) {
      res.status(400);
      throw new Error(`Found ${players.length} players out of 11 requested`);
    }

    // Build squad array for calculator
    const playerMap = {};
    players.forEach((p) => (playerMap[p._id.toString()] = p));

    const squadForCalc = squad.map((entry) => ({
      player: playerMap[entry.playerId],
      slotIndex: entry.slotIndex,
    }));

    const rating = calculateTeamRating(squadForCalc);

    res.json({ success: true, data: rating });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPlayers, getPlayerById, calculateSquadRating };
