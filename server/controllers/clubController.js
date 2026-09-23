const Club = require('../models/Club');

// @desc    Get all clubs (optional ?league=id filter)
// @route   GET /api/clubs
// @access  Public
const getClubs = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.league) {
      filter.league = req.query.league;
    }

    const clubs = await Club.find(filter).populate('league', 'name country').sort({ name: 1 });
    res.json({ success: true, count: clubs.length, data: clubs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single club by ID
// @route   GET /api/clubs/:id
// @access  Public
const getClubById = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id).populate('league', 'name country');

    if (!club) {
      res.status(404);
      throw new Error('Club not found');
    }

    res.json({ success: true, data: club });
  } catch (error) {
    next(error);
  }
};

module.exports = { getClubs, getClubById };
