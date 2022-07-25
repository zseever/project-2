const UserStockList = require('../models/portfolio');
const Stock = require('../models/stock');

module.exports = {
    index,
    new: newStock,
    create,
    edit,
    update
}

function index(req, res) {
    UserStockList.findOne({user:req.user._id}, (err,userLists) => {
        let userStocks = userLists.portfolio.map(x => x.T)
        Stock.find({T: { $in: userStocks}}, (err, stocks) => {
            let stocksList = {};
            stocks.forEach(x => {
                stocksList[x.T] = x.daily[x.daily.length-1].c;
            });
            let pnl = 0;
            userLists.portfolio.forEach(function(stock) {
                pnl += ((stocksList[stock.T] - stock.avgPrice)*stock.shares)
            });
            res.render('portfolios/index', { userLists , stocksList, pnl });
        })
    })
}

function update(req, res) {

};

function edit(req, res) {
    UserStockList.findOne({user:req.user._id}, (err,userLists) => {
        let editStock = userLists.portfolio.find(stock => stock.T === req.params.id)
        res.render('portfolios/edit', { editStock })
    })
}

function newStock(req, res) {
    res.render('portfolios/new');
}

function create(req, res) {
    req.body.dateAdded = new Date();
    UserStockList.findOne({user:req.user._id}, function(err, user) {
        if (user) {
            user.portfolio.push(req.body);
            user.save();
        } else {
            const newUserList = new UserStockList({
                user: req.user._id,
                userName: req.user.name,
                userAvatar: req.user.avatar,
                portfolio: [req.body]
            })
            newUserList.save();
        }
    })
    res.redirect('/portfolios');
}