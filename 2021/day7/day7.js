const fs = require("fs");
const text = (fs.readFileSync("input.txt")).toString();

input = text.split(",").map(Number).sort((a,b)=>a-b);

// find median
let median;
if(input.length % 2 === 0){
    // even, have to split
    i = input.length / 2
    median = (input[i-1]+input[i]) / 2
} else {
    i = Math.floor(input.length / 2);
    median = input[i]
}

// move all things to the median
cost = 0;
for (let crab of input) {
    cost += Math.abs(crab - median)
}

console.log(cost)

function triangleNumber(n) {
    return (n * (n + 1)) / 2;
}

// find mean (average)
let mean = Math.floor(input.reduce((a, b) => a + b, 0) / input.length);

cost = 0;
for (let crab of input) {
    cost += triangleNumber(Math.abs(crab - mean))
}

console.log(cost)