const Stock = require('../models/stock');

const fetch = require('node-fetch');
const token = process.env.POLYGON_TOKEN;
const rootURL = 'https://api.polygon.io/'

module.exports = {
    index,
}


function index(req, res) {
    Stock.find({T: { $in: ['AAPL','AMZN','MSFT','META','NVDA','GOOG','WMT','TSLA','GME']}}, function(err, stock) {
        let dailyStocks = stock.map(x => ({
            T: x.T,
            data: x.daily.map(y => y.c),
            labels: x.daily.map(y => y.t.toLocaleDateString('en-US'))
        }))
        res.render('home', { dailyStocks });
    })
    // Stock.findOne({}, function(err, stock) {
    //     let today = new Date();
    //     let yesterday = new Date();
    //     yesterday.setDate(today.getDate() - 1);
    //     if (stock.daily[stock.daily.length-1].t.toDateString() !== yesterday.toDateString()) {
    //         console.log('Updating stocks for new day')
    //         fetchDailyStocks(today,yesterday);
    //     } else {
    //         console.log('Stocks are already up to date');
    //     }
    // })
}

function fetchDailyStocks(today,yesterday) {
    let d = yesterday.getDate().toString().length === 2 ? `${yesterday.getDate()}` : `0${yesterday.getDate()}`;
    let m = (yesterday.getMonth()+1).toString().length === 2 ? `${yesterday.getMonth()+1}` : `0${yesterday.getMonth()+1}`
    let y = yesterday.getFullYear();
    let fetchDate = `${y}-${m}-${d}`
    fetch(`${rootURL}v2/aggs/grouped/locale/us/market/stocks/${fetchDate}?adjusted=true&apiKey=${token}`)
    .then(res => res.json())
    .then(stockData => {
        if (stockData.resultsCount === 0 || stockData.status === 'NOT_AUTHORIZED') {
            console.log('No data for today');
            return
        } else {
            addStock(stockData,yesterday);
        }
    })
}



function addStock(data, yesterday) {
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
                s.save();
            }
        })
    })
}

/*--- LEAVING THIS TO FETCH INDIVIDUAL STOCK HISTORICAL DATA AS API HAS LIMITATIONS */

// function oneTimeFetch() {
//     let ticker = "WMT";
//     fetch(`${rootURL}v2/aggs/ticker/${ticker}/range/1/day/2021-07-22/2022-07-22?adjusted=true&sort=asc&apiKey=${token}`)
//     .then(res => res.json())
//     .then(stockData => {
//         let newStock = new Stock({
//             T: ticker,
//             daily: stockData.results.map(s => {
//                 return {
//                     c: s.c,
//                     h: s.h,
//                     l: s.l,
//                     n: s.n,
//                     o: s.o,
//                     t: new Date(s.t),
//                     v: s.v,
//                     vw: s.vw,  
//                 }
//             })
//         })
//         newStock.save();
//         Stock.findOne({T:'WMT'}, function(err, stock) {
//             let stocksArr = stockData.results.map(s => {
//                 return {
//                     c: s.c,
//                     h: s.h,
//                     l: s.l,
//                     n: s.n,
//                     o: s.o,
//                     t: new Date(s.t),
//                     v: s.v,
//                     vw: s.vw,  
//                 }
//             });
//             stock.daily = stocksArr.concat(stock.daily);
//             stock.save();
//         })
//     })
// }