var express = require('express');
var router = express.Router();
const passport = require('passport');
const stocksCtrl = require('../controllers/stocks')


router.get('/:id', stocksCtrl.show);

module.exports = router;
