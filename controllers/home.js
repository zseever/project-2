const Stocks = require('../models/stocks');

const fetch = require('node-fetch');
const token = process.env.POLYGON_TOKEN;
const rootURL = 'https://api.polygon.io/'

module.exports = {
    index
}

function index(req, res) {
    res.render('home', { title: 'Daily Stocks' });
    fetch(`https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2022-07-21?adjusted=true&apiKey=GAhktOT6wvR7bPMp9650PCYwG2jUZ7yG`)
    .then(res => res.json())
    .then(stockData => {
      console.log(stockData.results.find(x => x.T === 'AAPL'));
    })

}