const express = require('express');
const router = express.Router();
const { calculateSquadRating } = require('../controllers/playerController');

router.post('/rating', calculateSquadRating);

module.exports = router;
