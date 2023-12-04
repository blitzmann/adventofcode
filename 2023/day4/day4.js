const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");
const matrix = lines.map((x) => x.split(""));
const isPartMatrix = lines.map((x) => x.split("").map((x) => null));

let totalSum = 0;

for (let line of lines) {
    let [card, numbers] = line.split(":");
    let [winning, have] = numbers
        .split("|")
        .map((x) => x.trim().split(/\s+/).map(Number));

    let numofWinning = have.map((have) =>
        winning.filter((x) => x === have).length > 0 ? 1 : 0
    );
    numofWinning = numofWinning.reduce((a, b) => a + b, 0);
    if (numofWinning !== 0) {
        totalSum += Math.pow(2, numofWinning - 1);
    }
    // let intersect = [...have].filter((i) => new Set(winning).has(i));
    // let intersectSet = new Set(
    //     [...have].filter((i) => new Set(winning).has(i))
    // );

    // if (intersect.length !== intersectSet.size) {
    //     console.log("sdasdf");
    // }
    // if (intersect.size !== 0) {
    //     totalSum += Math.pow(2, intersect.length - 1);
    // }
}

console.log(totalSum);

const copies = new Array(lines.length).fill(0);

for (let x = 0; x < lines.length; x++) {
    let line = lines[x];
    let [card, numbers] = line.split(":");
    let [winning, have] = numbers
        .split("|")
        .map((x) => x.trim().split(/\s+/).map(Number));

    let numofWinning = have.map((have) =>
        winning.filter((x) => x === have).length > 0 ? 1 : 0
    );
    numofWinning = numofWinning.reduce((a, b) => a + b, 0);
    let myCopies = copies[x];
    // +1 to handle the current, original.
    for (let j = 0; j < myCopies + 1; j++) {
        if (numofWinning > 0) {
            for (let i = 0; i < numofWinning; i++) {
                if (x + 1 + i <= copies.length - 1) {
                    copies[x + 1 + i]++;
                }
            }
        }
    }
}

console.log(lines.length + copies.reduce((a, b) => a + b, 0));
