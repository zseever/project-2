const UserStockList = require('../models/portfolio');
const Stock = require('../models/stock');

module.exports = {
    index,
    new: newStock,
    create,
    edit,
    update,
    delete: deleteStock,
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

function deleteStock(req, res) {
    UserStockList.findOne({user:req.user._id}, (err, userLists) => {
        let idx = userLists.portfolio.findIndex(x => x.T === req.params.id);
        userLists.portfolio.splice(idx, 1);
        userLists.save();
        res.redirect('/portfolios');
    })
}

function update(req, res) {
    UserStockList.findOne({user:req.user._id})
        .where('T').equals(req.params.id)
        .exec(function(err, stock) {
            let idx = stock.portfolio.findIndex(x => x.T === req.params.id)
            stock.portfolio[idx].shares = req.body.shares;
            stock.portfolio[idx].avgPrice = req.body.avgPrice;
            stock.save();
            res.render('portfolios/index')
        })
        
        
        // (err,userLists) => {
        // console.log(req.params.id);
        // console.log(userLists);
        // let stock = userLists.portfolio.find(x => x.T === req.params.id);
        //     stock.shares = req.body.shares;
        //     stock.avgPrice = req.body.avgPrice;
        //     console.log(stock);
        //     res.redirect('/portfolios');
        // })
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