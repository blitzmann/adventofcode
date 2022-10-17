const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

let numbers = text.split("\n").map(Number);
numbers.sort((a, b) => b - a);
let sum = numbers.reduce((a, b) => a + b);

// part 1: getting the smallest array

function findNum(row, col) {
    let col1Value = [...Array(row)]
        .map((_, i) => i)
        .reduce((a, e) => {
            return a + e;
        }, 1);

    let t = [...Array(col - 1)]
        .map((_, i) => i)
        .reduce((a, e) => {
            return a + e + row + 1;
        }, col1Value);

    return t;
}

function findCode(value) {
    let a = 20151125;
    for (let i = 1; i < value; i++) {
        a = (a * 252533) % 33554393;
    }
    return a;
}

console.log(findCode(findNum(2978, 3083)));
