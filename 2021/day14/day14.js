const { match } = require("assert");
const { Console } = require("console");
const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

let input = text.split("\r\n\r\n");

const originalTemplate = input[0].trim();
let template = originalTemplate;

let rules = new Map(
    input[1].split("\r\n").map((x) => {
        let m = x.trim().match(/(.+) -> (.+)/);
        return [m[1], m[2]];
    })
);

/**
 * Part 1 step, takes template and builds out the string as needed
 */
function step() {
    let insertions = [];
    for (let rule of rules.keys()) {
        var regex = new RegExp(rule, "gi"),
            result;
        while ((result = regex.exec(template))) {
            insertions.push([result.index + 1, rules.get(rule)]);
            regex.lastIndex = result.index + 1; // TIL https://stackoverflow.com/a/33903830/788054
        }
    }

    // insert backwards to avoid insertions from interferring with the indexes later on
    for (let [idx, char] of insertions.sort((a, b) => b[0] - a[0])) {
        template = template.slice(0, idx) + char + template.slice(idx);
    }
}

/// ----------------------- Part 2
template = originalTemplate; // reset template

// create map of all initial pairs and their count
let tracker = new Map();
for (let rule of rules.keys()) {
    var regex = new RegExp(rule, "gi"),
        result,
        count = 0;
    while ((result = regex.exec(template))) {
        count++;
        regex.lastIndex = result.index + 1; // TIL https://stackoverflow.com/a/33903830/788054
    }
    tracker.set(rule, count);
}

/**
 * part two stepper
 *
 * For part two, we do something similar to the lanternfish part 2 problem.
 * Instead of a 100% simulation, we understand that 1 pair will turn into 2 pair.
 * We can iterate through the different pairs and know what other pairs they
 * are going to produce.
 *
 * To avoid double counting when counting the individual letters, we only take
 * the first letter from the pair, and then count +1 for the very last character
 * on the template (since it will never change). This part is done in the step loop
 * itself.
 */
function step2() {
    const tmp = new Map();
    // iterate through all pairs, and then split. Create 2 new pairs and store in a map.
    //  eg: if CB has 3 instances, then we increment CH and HB by 3
    for (let [pair, char] of rules.entries()) {
        let numOfPair = tracker.get(pair) || 0;

        let pairArr = pair.split("");
        tmp.set(
            pairArr[0] + char,
            (tmp.get(pairArr[0] + char) || 0) + numOfPair
        );
        tmp.set(
            char + pairArr[1],
            (tmp.get(char + pairArr[1]) || 0) + numOfPair
        );
    }
    // set the tracker to our current iteration
    tracker = tmp;
}

// loop that runs the steps.
for (let x = 0; x < 10; x++) {
    step(); // part 1 step
}

let arr = template.split("");
let freq = [...new Set(arr)].map((x) => [arr.filter((y) => x === y).length, x]);
let max = freq.sort((a, b) => b[0] - a[0])[0][0];
let min = freq.sort((a, b) => a[0] - b[0])[0][0];

console.log(max - min);

for (let x = 0; x < 40; x++) {
    step2(); // part 2 step
}

var score = new Map();
for (let [pair, count] of tracker.entries()) {
    let char = pair.split("")[0];
    score.set(char, (score.get(char) || 0) + count);
}

let templateSplit = template.split("");

let lastChar = templateSplit.reverse()[0];
score.set(lastChar, (score.get(lastChar) || 0) + 1);

max = [...score.values()].sort((a, b) => b - a)[0];
min = [...score.values()].sort((a, b) => a - b)[0];
console.log(max - min);

// CN is broke for step 5, shows 5 but should be 6
// CN can be created via HN, NN, CN (for the second)  and CC for the first
