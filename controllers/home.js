const Stocks = require('../models/stock');

const fetch = require('node-fetch');
const token = process.env.POLYGON_TOKEN;
const rootURL = 'https://api.polygon.io/'

module.exports = {
    index,
    fetchDailyStocks
}

function fetchDailyStocks() {
    let today = new Date();
    let d = today.getDate()-1;
    let m = (today.getMonth()+1).length === 2 ? `${today.getMonth()+1}` : `0${today.getMonth()+1}`
    let y = today.getFullYear();
    today = `${y}-${m}-${d}`
    fetch(`${rootURL}v2/aggs/grouped/locale/us/market/stocks/${today}?adjusted=true&apiKey=${token}`)
    .then(res => res.json())
    .then(stockData => {
        console.log(`${rootURL}v2/aggs/grouped/locale/us/market/stocks/${today}?adjusted=true&apiKey=${token}`)
        console.log(stockData.results);
    })
}

function index(req, res) {
    const stocks = fetchDailyStocks();
    res.render('home', { title: 'Daily Stocks' });

}