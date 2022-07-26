const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockDetailSchema = new Schema({
    ticker: String,
    name: String,
    description: String,
    homepage_url: String,
    market_cap: Number,
    employees: Number,
    shares_outstanding: Number,
    currency: String,
    address: {
        address1: String,
        city: String,
        zipcode: String,
        state: String,
    },
    branding: {
        icon_url: String,
        logo_url: String,
    },
})

module.exports = mongoose.model('StockInfo', stockDetailSchema);