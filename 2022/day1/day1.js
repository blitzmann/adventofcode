const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const elves = text.split("\r\n\r\n");

let groups = elves.map((x) =>
    x
        .split("\n")
        .map(Number)
        .reduce((a, b) => a + b, 0)
);

console.log("Part 1: ", Math.max(...groups));

console.log(
    "Part 2: ",
    groups
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((a, b) => a + b, 0)
);
