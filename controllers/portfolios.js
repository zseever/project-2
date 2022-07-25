const UserStockList = require('../models/portfolio');
const User = require('../models/user');

module.exports = {
    index,
    new: newStock
}

function index(req, res) {
    res.render('portfolios/index');
}

function newStock(req, res) {
    res.render('portfolios/new');
}