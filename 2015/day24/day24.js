const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

let numbers = text.split("\n").map(Number);
numbers.sort((a, b) => b - a);
let sum = numbers.reduce((a, b) => a + b);

// part 1: getting the smallest array

function split(num) {
    let target = sum / num;
    let size = null;
    const results = [];
    for (let j = 0; j < numbers.length; j++) {
        const result = [];
        result.sum = 0;
        for (let i = j; i < numbers.length; i++) {
            let test = numbers[i];
            if (result.sum + test <= target) {
                result.push(test);
                result.sum += test;
                result.qe = result.reduce((a, b) => a * b, 1);
            }

            if (result.sum === target) {
                size = result.length;
                results.push(result);
                break;
            }
            if (size && result.length > size) {
                break;
            }
        }
    }

    return results;
}

console.log(
    "part 1: ",

    split(3)
        .map((x) => x.qe)
        .sort((a, b) => a - b)[0]
);

console.log(
    "part 2: ",
    split(4)
        .map((x) => x.qe)
        .sort((a, b) => a - b)[0]
);
// console.log(
//     "Part 1: ",
//     result.reduce((a, b) => a * b, 1)
// );

// result = split(4);
// console.log(result);
// console.log(
//     "Part 2: ",
//     result.reduce((a, b) => a * b, 1)
// );
