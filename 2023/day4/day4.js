const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");

let totalSum = 0;
const copies = new Array(lines.length).fill(1);

for (let [x, line] of lines.entries()) {
    let [_, numbers] = line.split(":");
    let [winning, have] = numbers
        .split("|")
        .map((x) => x.trim().split(/\s+/).map(Number));

    // determine how many winning numbers we have.
    let numofWinning = have.filter((have) => winning.includes(have)).length;

    // determine how many times we need to run our win logic (part 2)
    let myCopies = copies[x];

    if (numofWinning !== 0) {
        // part 1
        // keep running sum of points
        totalSum += Math.pow(2, numofWinning - 1);

        // part 2
        // for each copy of this card, we must run the logic to allocate new copies.
        for (let j = 0; j < myCopies; j++) {
            // for each winning card,
            for (let i = 1; i <= numofWinning; i++) {
                let targetCard = x + i;
                // only target cards that are in our array
                // (rules state "Cards will never make you copy a card past the end of the table" but I don't know if this is baked into the input
                // or if the logic should just be ignored for ones that are out of range)
                if (targetCard <= copies.length - 1) {
                    copies[targetCard]++;
                }
            }
        }
    }
}

console.log(totalSum);
console.log(copies.reduce((a, b) => a + b, 0));
