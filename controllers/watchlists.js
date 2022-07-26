const UserStockList = require('../models/portfolio');
const Stock = require('../models/stock');

module.exports = {
    index,
    create
}

function index(req, res) {
    UserStockList.findOne({user:req.user._id}, (err, userLists) => {
        let userStocks = userLists.watchlist.map(x => x.T)
        Stock.find({T: { $in: userStocks}}, (err, stocks) => {
            let stocksList = {};
            stocks.forEach(x => {
                stocksList[x.T] = x.daily[x.daily.length-1].c;
            });
        res.render('watchlists/index', { userLists, stocksList })
        });
    });
}

function create(req, res) {
    req.body.dateAdded = new Date();
    UserStockList.findOne({user:req.user._id}, function(err, user) {
        if (user) {
            user.watchlist.push(req.body);
            user.save();
        } else {
            const newUserList = new UserStockList({
                user: req.user._id,
                userName: req.user.name,
                userAvatar: req.user.avatar,
                watchlist: [req.body]
            })
            newUserList.save();
        }
    })
    res.redirect('/watchlists');    
}

