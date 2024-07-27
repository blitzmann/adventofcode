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
        .map(replaceWords)
        .map((x) => x.replace(/[^\d]+/g, ""))
        .map((x) => x.substring(0, 1) + x.slice(-1))
        .map(Number)
        .reduce((a, b) => a + b, 0)
);

function replaceWords(string) {
    // we need to find the index of each and replace the first one found. We do this by tracking the index.
    // we use a while loop as we have to get all words. Each iteration will replace the first instance of the word.
    while (true) {
        let idx = Infinity;
        let selected = null;
        for (let word of numbers) {
            let testIdx = string.indexOf(word);
            if (testIdx > -1 && testIdx < idx) {
                idx = testIdx;
                selected = word;
            }
        }
        if (idx === Infinity) {
            // no more words found, break out of while loop
            break;
        }
        // we know which word we need to replace now, replace it and start over.
        string = string.replace(selected, numbers.indexOf(selected) + 1);
    }
    return string;
}
