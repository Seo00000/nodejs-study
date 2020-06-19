const mongoose = require('mongoose');

module.exports = () => {
    const connect = () => {
        if(process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
    }
}
//https://thebook.io/006982/ch08/06/01-01/ 진행중 commit