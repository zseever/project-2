const UserStockList = require('../models/portfolio');
const User = require('../models/user');

module.exports = {
    index,
    new: newStock,
    create
}

function index(req, res) {
    UserStockList.findOne({user:req.user._id}, (err,userLists) => {
        res.render('portfolios/index', { userLists });
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