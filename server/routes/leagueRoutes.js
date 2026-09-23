const express = require('express');
const router = express.Router();
const { getLeagues, getLeagueById } = require('../controllers/leagueController');

router.get('/', getLeagues);
router.get('/:id', getLeagueById);

module.exports = router;
