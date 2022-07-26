const express = require('express');
const router = express.Router();
const watchlistsCtrl = require('../controllers/watchlists');
const isLoggedIn = require('../config/auth');

router.get('/', isLoggedIn, watchlistsCtrl.index);
router.post('/', isLoggedIn, watchlistsCtrl.create);
router.delete('/:id', isLoggedIn, watchlistsCtrl.delete);


module.exports = router;