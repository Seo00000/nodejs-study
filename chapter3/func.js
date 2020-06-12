// import {odd, even} from './var';
const {odd, even} = require('./var');

function checkOddEven(num){
    if(num % 2){
        return odd;
    }
    return even;
}

// export default checkOddEven;
module.exports = checkOddEven;