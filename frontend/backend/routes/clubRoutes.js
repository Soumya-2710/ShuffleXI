const express = require('express');
const router = express.Router();
const { getClubs, getClubById } = require('../controllers/clubController');

router.get('/', getClubs);
router.get('/:id', getClubById);

module.exports = router;
