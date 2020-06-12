setImmediate(() => {
    console.log('immediate'); //4
});
process.nextTick(() => {
    console.log('nextTick'); //1
});
setTimeout(() => {
    console.log('timeout'); //3
}, 0);
Promise.resolve().then(() => console.log('promise')); //2