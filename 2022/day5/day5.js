const fs = require("fs");
const { consumers } = require("stream");
const text = fs.readFileSync("input.txt").toString();

const [top, bottom] = text.split("\r\n\r\n").map((x) => x.split("\r\n"));

top.pop(); // delete the junk stack labeling

processed = top
    .map((line) => line.match(/.{1,4}/g).map((x) => x.trim()))
    .reverse();

function processData(processed) {
    let state = new Map();

    // process data into a Map<stackNum, crates[]>
    for (let i = 0; i < processed.length; i++) {
        for (let j = 1; j <= processed[i].length; j++) {
            let bucket = state.get(j);
            if (!bucket) {
                bucket = [];
                state.set(j, bucket);
            }
            letter = processed[i][j - 1].match(/\w/g);
            if (letter) {
                bucket.push(letter[0]);
            }
        }
    }
    return state;
}

let state = processData(processed);

for (let ins of bottom) {
    const [_, num, from, to] = ins.match(/move (\d+) from (\d+) to (\d+)/);
    fromBucket = state.get(+from);
    toBucket = state.get(+to);
    for (let i = 0; i < num; i++) {
        toBucket.push(fromBucket.pop());
    }
}

let part1 = "";
for (let val of state.keys()) {
    part1 += state.get(val).pop();
}
console.log("Part 1: ", part1);

state = processData(processed);

for (let ins of bottom) {
    const [_, num, from, to] = ins.match(/move (\d+) from (\d+) to (\d+)/);
    fromBucket = state.get(+from);
    toBucket = state.get(+to);
    let chunk = fromBucket.splice(-+num, num);
    toBucket.push(...chunk);
}

let part2 = "";
for (let val of state.keys()) {
    part2 += state.get(val).pop();
}
console.log("Part 2: ", part2);
