const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

let [mappings, chem] = text.split("\r\n\r\n").map((x) => x.trim());

replacements = new Map();

function generateReplacements(mappings) {
    mappings.split("\n").map((x) => {
        let [from, to] = x.split(" => ").map((x) => x.trim());
        let toArr = [];
        if (replacements.has(from)) {
            toArr = replacements.get(from);
        }
        toArr.push(to);
        replacements.set(from, toArr);
    });
}

function start(input) {
    let inArr = input.split(/(?=[A-Z])/); // split on capital letters
    let set = new Set();
    for (let i = 0; i < inArr.length; i++) {
        let char = inArr[i];
        let arrCopy = [...inArr];
        let toArr = replacements.get(char);
        if (!toArr) continue;
        for (let to of toArr) {
            arrCopy[i] = to;
            set.add(arrCopy.join(""));
        }
    }
    return set;
}

generateReplacements(mappings);

let set = start(chem);
console.log(set.size);

function nextStep(input, step) {
    let inArr = input.split(/(?=[A-Z])/); // split on capital letters
    // find the replacements for each one anc continue to recurse with the replaced value
    let set = new Set();
    loop1: for (let i = 0; i < inArr.length; i++) {
        let char = inArr[i];
        let arrCopy = [...inArr];
        let toArr = replacements.get(char);
        if (!toArr) continue;
        loop2: for (let to of toArr) {
            arrCopy[i] = to;
            let result = arrCopy.join("");
            if (result.length > chem.length) {
                continue;
            }
            set.add(result);
        }
    }
    return set;
}

// part 2
// this is taking too long due to exponential growth. Need to figure out how to better it. I do not yet have an answer for part 2
set = new Set(["e"]);
step = 0;
while (true) {
    step++;
    console.log(step);
    let newSet = new Set();
    for (let test of [...set]) {
        newSet = new Set([...newSet, ...nextStep(test)]);
    }

    set = newSet;
    if (set.has(chem)) break;
}

console.log(step);
