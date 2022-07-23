const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema({
    T: String,
    daily: {
        c: Number,
        h: Number,
        l: Number,
        n: Number,
        o: Number,
        t: Number,
        v: Number,
        vw: Number,  
    }
})

module.exports = mongoose.model('Stock', stockSchema);