const express = require('express');
const router = express.Router();
const portfoliosCtrl = require('../controllers/portfolios');
const isLoggedIn = require('../config/auth');

router.get('/', isLoggedIn, portfoliosCtrl.index);
router.get('/new', isLoggedIn, portfoliosCtrl.new);
router.post('/', isLoggedIn, portfoliosCtrl.create);


module.exports = router;