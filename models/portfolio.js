const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userStockListSchema = new Schema({
    user: {type:Schema.Types.ObjectId, ref: 'User'},
    userName: String,
    userAvatar: String,
    portfolio: [{
        T: String,
        shares: Number,
        avgPrice: Number,
        dateAdded: Date
    }],
    watchlist: [{
        T: String,
        dateAdded: Date
    }]
});

module.exports = mongoose.model('UserStockList', userStockListSchema);