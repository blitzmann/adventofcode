const fs = require('fs');
const path = require("path");
const arr = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n').map(i => parseInt(i));

function calculateFuel(n, recurse = false) {
    let ret = Math.floor(n / 3) - 2;

    if (ret > 0) {
        return ret + (recurse ? calculateFuel(ret, recurse) : 0);
    }
    return 0;
}

const sum = (a, b) => a + b

// .map() to transform each line of input to the fuel, and .reduce to sum them all up
console.log(`Part 1: ${arr.map(s => calculateFuel(s)).reduce(sum)}`)  

console.log(`Part 2: ${arr.map(s => calculateFuel(s, true)).reduce(sum)}`)
