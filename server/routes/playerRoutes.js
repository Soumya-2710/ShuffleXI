const express = require('express');
const router = express.Router();
const { getPlayers, getPlayerById } = require('../controllers/playerController');

router.get('/', getPlayers);
router.get('/:id', getPlayerById);

module.exports = router;

