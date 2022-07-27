const Stock = require('../models/stock');
const StockInfo = require('../models/stockinfo')

const fetch = require('node-fetch');
const token = process.env.POLYGON_TOKEN;
const rootURL = 'https://api.polygon.io/'

module.exports = {
    show
}

function show(req, res) {
    console.log('show function running')
    if (req.params.id === 'search') {
        StockInfo.findOne({ticker:req.query.T}, (err, stock) => {
            if (!stock) {
                fetch(`${rootURL}v3/reference/tickers/${req.query.T}?apiKey=${token}`)
                .then(res => res.json())
                .then(s => {
                    console.log(s);
                    if (s.status === 'NOT_FOUND') {
                        res.redirect('/');
                        return;
                    }
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
                    res.render('stocks/show', { stock: sInfo });
                });  
            } else {
                console.log('false path')
                res.render('stocks/show', { stock });
            }
        })        
    } else {
        StockInfo.findOne({ticker:req.params.id}, (err, stock) => {
            if (!stock) {
                fetch(`${rootURL}v3/reference/tickers/${req.params.id}?apiKey=${token}`)
                .then(res => res.json())
                .then(s => {
                    console.log(s);
                    if (s.status === 'NOT_FOUND') {
                        res.redirect('/');
                        return;
                    }
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
                    res.render('stocks/show', { stock: sInfo });
                });  
            } else {
                console.log('false path')
                res.render('stocks/show', { stock });
            }
        })
    }
}