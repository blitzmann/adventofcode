const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");

console.log(
    lines
        .map((x) => x.replace(/[^\d]+/g, ""))
        .map((x) => x.substring(0, 1) + x.slice(-1))
        .map(Number)
        .reduce((a, b) => a + b, 0)
);

let numbers = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
];

console.log(
    lines
        .map(replacePhonetic)
        .map((x) => x.replace(/[^\d]+/g, ""))
        .map((x) => x.substring(0, 1) + x.slice(-1))
        .map(Number)
        .reduce((a, b) => a + b, 0)
);

function replacePhonetic(string) {
    // we need to find the index of each and replace the latest one
    while (true) {
        let idx = Infinity;
        let selected = null;
        for (let ph of numbers) {
            let testIdx = string.indexOf(ph);
            if (testIdx > -1 && testIdx < idx) {
                idx = testIdx;
                selected = ph;
            }
        }
        if (idx === Infinity) {
            break;
        }

        string = string.replace(selected, numbers.indexOf(selected) + 1);
    }
    return string;
}
