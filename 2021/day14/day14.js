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

// part two stepper
function step2() {
    const tmp = new Map();
    // iterate through all pairs, and then split. Create 2 new pairs and store in a map.
    //  eg: if CB has 3 instances, then we increment CH and HB by 3
    for (let [pair, char] of rules.entries()) {
        let numOfPair = tracker.get(pair);

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
for (let x = 0; x < 5; x++) {
    console.log("==========\nStep " + (x + 1));
    step(); // part 1 step
    step2(); // part 2 step

    // Part 1 stuff
    let arr = template.split("");
    let freq = [...new Set(arr)].map((x) => [
        arr.filter((y) => x === y).length,
        x,
    ]);
    let max = freq.sort((a, b) => b[0] - a[0])[0][0];
    let min = freq.sort((a, b) => a[0] - b[0])[0][0];

    console.log("Part 1:", max - min);
    console.log("Template: ", template);

    // part 2

    var score = new Map();
    for (let [pair, count] of tracker.entries()) {
        let char = pair.split("")[0];
        score.set(char, (score.get(char) || 0) + count);
    }

    let templateSplit = template.split("");

    let trueCounts = {
        C: templateSplit.filter((x) => x === "C").length,
        B: templateSplit.filter((x) => x === "B").length,
        H: templateSplit.filter((x) => x === "H").length,
        N: templateSplit.filter((x) => x === "N").length,
    };
    let lastChar = templateSplit.reverse()[0];
    score.set(lastChar, (score.get(lastChar) || 0) + 1);

    console.log("True counts (from part 1):   ", trueCounts);
    console.log("Scores (from part 2): ", score);
    console.log("Tracker (from part 2):", tracker);
}

// CN is broke for step 5, shows 5 but should be 6
// CN can be created via HN, NN, CN (for the second)  and CC for the first
