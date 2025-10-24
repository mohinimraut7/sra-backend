const express = require('express');
const router = express.Router();
const hutController = require('../controllers/hutController');

// POST: Add Hut
router.post('/add', hutController.addHut);

// GET: Get All Huts
router.get('/all', hutController.getAllHuts);

module.exports = router;
