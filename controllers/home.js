const Stock = require('../models/stock');

const fetch = require('node-fetch');
const stock = require('../models/stock');
const token = process.env.POLYGON_TOKEN;
const rootURL = 'https://api.polygon.io/'

module.exports = {
    index,
    fetchDailyStocks,
    addStock
}


function fetchDailyStocks() {
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    let d = today.getDate()-1;
    let m = (today.getMonth()+1).length === 2 ? `${today.getMonth()+1}` : `0${today.getMonth()+1}`
    let y = today.getFullYear();
    today = `${y}-${m}-${d}`

    fetch(`${rootURL}v2/aggs/grouped/locale/us/market/stocks/${today}?adjusted=true&apiKey=${token}`)
    .then(res => res.json())
    .then(stockData => {
        addStock(stockData);
    })
}

function index(req, res) {
    Stock.find({T: { $in: ['AAPL','AMZN','MSFT','META','NVDA','GOOG','WMT','TSLA','GME']}}, function(err, stock) {
        res.render('home', { stock });
    })
    fetchDailyStocks();
}


function addStock(data) {
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    data.results.forEach(function(x) {
        Stock.findOne({T:x.T}, function(err, s) {
            if (!s) {
                let stock = new Stock({
                    T: x.T,
                    daily: {
                        c: x.c,
                        h: x.h,
                        l: x.l,
                        n: x.n,
                        o: x.o,
                        t: new Date(x.t),
                        v: x.v,
                        vw: x.vw,  
                    }
                })
                stock.save();
            } else if (s.daily[s.daily.length-1].t.toDateString() !== yesterday.toDateString()) {
                s.daily.push({
                    c: x.c,
                    h: x.h,
                    l: x.l,
                    n: x.n,
                    o: x.o,
                    t: new Date(x.t),
                    v: x.v,
                    vw: x.vw,  
                })
                stock.save();
            }
        })
    })
}