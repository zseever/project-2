const Portfolio = require('../models/portfolio');

module.exports = {
    index
}

function index(req, res) {
    res.render('portfolios/index');
}