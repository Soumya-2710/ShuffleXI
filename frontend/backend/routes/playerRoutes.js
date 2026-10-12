const express = require('express');
const router = express.Router();
const { getPlayers, getPlayerById, getShuffleCandidates } = require('../controllers/playerController');

router.get('/shuffle-candidates', getShuffleCandidates);
router.get('/', getPlayers);
router.get('/:id', getPlayerById);

module.exports = router;

