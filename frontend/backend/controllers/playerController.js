const Player = require('../models/Player');
const { calculateTeamRating, calculateSquadChemistry } = require('../utils/ratingCalculator');

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
      .populate('club', 'name logo')
      .populate('league', 'name country')
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

// @desc    Get randomized candidates for squad shuffle roulette
// @route   GET /api/players/shuffle-candidates
// @access  Public
const getShuffleCandidates = async (req, res, next) => {
  try {
    const { slot, group, league, exclude, count = 8 } = req.query;
    const filter = {};

    if (slot) {
      filter.position = slot.toUpperCase();
    } else if (group) {
      if (group === 'GK') filter.position = 'GK';
      else if (group === 'DEF') filter.position = { $in: ['CB', 'LB', 'RB'] };
      else if (group === 'MID') filter.position = { $in: ['CDM', 'CM', 'CAM'] };
      else if (group === 'ATK') filter.position = { $in: ['LW', 'RW', 'ST', 'CF'] };
    }

    if (league) {
      filter.league = league;
    }

    if (exclude) {
      const excludeIds = exclude
        .split(',')
        .filter(Boolean)
        .map((id) => (id.length === 24 ? id : null))
        .filter(Boolean);
      if (excludeIds.length > 0) {
        filter._id = { $nin: excludeIds };
      }
    }

    const numCandidates = Math.min(20, Math.max(3, parseInt(count, 10) || 8));

    // Prioritize candidates with authentic cutouts/photos like Saliakas!
    const imageCandidates = await Player.aggregate([
      { $match: { ...filter, image: { $exists: true, $ne: null, $nin: ['', null] } } },
      { $sample: { size: numCandidates } },
      {
        $lookup: {
          from: 'clubs',
          localField: 'club',
          foreignField: '_id',
          as: 'club',
        },
      },
      { $unwind: { path: '$club', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'leagues',
          localField: 'league',
          foreignField: '_id',
          as: 'league',
        },
      },
      { $unwind: { path: '$league', preserveNullAndEmptyArrays: true } },
    ]);

    if (imageCandidates && imageCandidates.length >= Math.min(3, numCandidates)) {
      return res.json({ success: true, count: imageCandidates.length, candidates: imageCandidates });
    }

    // Fallback: general sample
    const candidates = await Player.aggregate([
      { $match: filter },
      { $sample: { size: numCandidates } },
      {
        $lookup: {
          from: 'clubs',
          localField: 'club',
          foreignField: '_id',
          as: 'club',
        },
      },
      { $unwind: { path: '$club', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'leagues',
          localField: 'league',
          foreignField: '_id',
          as: 'league',
        },
      },
      { $unwind: { path: '$league', preserveNullAndEmptyArrays: true } },
    ]);

    if (!candidates || candidates.length === 0) {
      const fallback = await Player.find(filter)
        .populate('club', 'name logo')
        .populate('league', 'name country')
        .limit(numCandidates);
      return res.json({ success: true, count: fallback.length, candidates: fallback });
    }

    res.json({ success: true, count: candidates.length, candidates });
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
    const players = await Player.find({ _id: { $in: playerIds } })
      .populate('club', 'name logo')
      .populate('league', 'name country');

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
    const chemistry = calculateSquadChemistry(squadForCalc);

    res.json({ success: true, data: { ...rating, chemistry: chemistry.chemistry, maxChemistry: 33, chemistryDetails: chemistry.details } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPlayers, getPlayerById, getShuffleCandidates, calculateSquadRating };

