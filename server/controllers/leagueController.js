const League = require('../models/League');

// @desc    Get all leagues
// @route   GET /api/leagues
// @access  Public
const getLeagues = async (req, res, next) => {
  try {
    const leagues = await League.find({}).sort({ name: 1 });
    res.json({ success: true, count: leagues.length, data: leagues });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single league by ID
// @route   GET /api/leagues/:id
// @access  Public
const getLeagueById = async (req, res, next) => {
  try {
    const league = await League.findById(req.params.id);

    if (!league) {
      res.status(404);
      throw new Error('League not found');
    }

    res.json({ success: true, data: league });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeagues, getLeagueById };
