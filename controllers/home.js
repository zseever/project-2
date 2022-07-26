const Stock = require('../models/stock');
const StockInfo = require('../models/stockinfo')

const fetch = require('node-fetch');
const stock = require('../models/stock');
const token = process.env.POLYGON_TOKEN;
const rootURL = 'https://api.polygon.io/'

module.exports = {
    index,
    fetchDailyStocks,
    // addStock,
    show
}

// function createCandleStickChart(barCount,initialDate) {

// }


function index(req, res) {
    Stock.find({T: { $in: ['AAPL','AMZN','MSFT','META','NVDA','GOOG','WMT','TSLA','GME']}}, function(err, stock) {
        res.render('home', { stock });
    })
    Stock.findOne({}, function(err, stock) {
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (stock.daily[stock.daily.length-1].t.toDateString() !== yesterday.toDateString()) {
            console.log('Updating stocks for new day')
            fetchDailyStocks();
        } else {
            console.log('Stocks are already up to date');
        }
    })
}

function show(req, res) {
    StockInfo.findOne({ticker:req.params.id}, (err, stock) => {
        if (!stock) {
            fetch(`${rootURL}v3/reference/tickers/${req.params.id}?apiKey=${token}`)
            .then(res => res.json())
            .then(s => {
                console.log(s);
                let sInfo = new StockInfo ({
                    ticker: s.results.ticker,
                    name: s.results.name,
                    description: s.results.description,
                    homepage_url: s.results.homepage_url,
                    market_cap: s.results.market_cap,
                    employees: s.results.total_employees,
                    shares_outstanding: s.results.share_class_shares_outstanding,
                    currency: s.results.currency_name,
                    address: {
                        address1: s.results.address.address1,
                        city: s.results.address.city,
                        zipcode: s.results.address.postal_code,
                        state: s.results.address.state,
                    },
                    branding: {
                        icon_url: s.results.branding.icon_url,
                        logo_url: s.results.branding.logo_url,
                    }
                });
                console.log('true path');
                sInfo.save();
                res.render('show', { stock: sInfo });
            });  
        } else {
            console.log('false path')
            res.render('show', { stock });
        }
    })
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
        if (stockData.resultsCount === 0) {
            console.log('No data for today');
            return
        } else {
            stockData.results.forEach(function(x) {
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
                        console.log('attempting to push new data')
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
    })
}

// function addStock(data) {
//     let today = new Date();
//     let yesterday = new Date();
//     yesterday.setDate(today.getDate() - 1);
//     data.results.forEach(function(x) {
//         Stock.findOne({T:x.T}, function(err, s) {
//             if (!s) {
//                 let stock = new Stock({
//                     T: x.T,
//                     daily: {
//                         c: x.c,
//                         h: x.h,
//                         l: x.l,
//                         n: x.n,
//                         o: x.o,
//                         t: new Date(x.t),
//                         v: x.v,
//                         vw: x.vw,  
//                     }
//                 })
//                 stock.save();
//             } else if (s.daily[s.daily.length-1].t.toDateString() !== yesterday.toDateString()) {
//                 s.daily.push({
//                     c: x.c,
//                     h: x.h,
//                     l: x.l,
//                     n: x.n,
//                     o: x.o,
//                     t: new Date(x.t),
//                     v: x.v,
//                     vw: x.vw,  
//                 })
//                 stock.save();
//             }
//         })
//     })
// }

/*--- LEAVING THIS TO FETCH INDIVIDUAL STOCK HISTORICAL DATA AS API HAS LIMITATIONS */

// function oneTimeFetch() {
//     let today = new Date();    
//     let d = today.getDate()-1;
//     let m = (today.getMonth()+1).length === 2 ? `${today.getMonth()+1}` : `0${today.getMonth()+1}`
//     let y = today.getFullYear();
//     today = `${y}-${m}-${d}`  
//     let ticker = "WMT";
//     fetch(`${rootURL}v2/aggs/ticker/${ticker}/range/1/day/2021-07-22/2022-07-22?adjusted=true&sort=asc&apiKey=${token}`)
//     .then(res => res.json())
//     .then(stockData => {
//         // console.log(stockData.results);
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
        // Stock.findOne({T:'WMT'}, function(err, stock) {
        //     let stocksArr = stockData.results.map(s => {
        //         return {
        //             c: s.c,
        //             h: s.h,
        //             l: s.l,
        //             n: s.n,
        //             o: s.o,
        //             t: new Date(s.t),
        //             v: s.v,
        //             vw: s.vw,  
        //         }
        //     });
        //     stock.daily = stocksArr.concat(stock.daily);
        //     stock.save();
        // })
//     })
// }