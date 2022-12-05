const fs = require("fs");
const { consumers } = require("stream");
const text = fs.readFileSync("input.txt").toString();

const [top, bottom] = text.split("\r\n\r\n").map((x) => x.split("\r\n"));

processed = top.map((line) => line.match(/.{1,4}/g).map((x) => x.trim()));

processed.reverse();
processed.shift(); // delete the junk stack labeling

const state = new Map();

for (let i = 0; i < processed.length; i++) {
    for (let j = 0; j < processed[i].length; j++) {
        thing = processed[i][j];
        let bucket = state.get(j);
        if (!state.has(j)) {
            bucket = [];
            state.set(j, bucket);
        }
        letter = thing.match(/\w/g);
        if (letter) {
            bucket.push(letter[0]);
        }
    }
}

// for (let ins of bottom) {
//     const [_, num, from, to] = ins.match(/move (\d+) from (\d+) to (\d+)/);
//     fromBucket = state.get(+from - 1);
//     toBucket = state.get(+to - 1);
//     for (let i = 0; i < num; i++) {
//         toBucket.push(fromBucket.pop());
//     }
// }

// let part1 = "";
// for (let val of state.keys()) {
//     part1 += state.get(val).pop();
// }
// console.log(part1);

for (let ins of bottom) {
    const [_, num, from, to] = ins.match(/move (\d+) from (\d+) to (\d+)/);
    fromBucket = state.get(+from - 1);
    toBucket = state.get(+to - 1);
    let chunck = fromBucket.splice(-+num, num);
    toBucket.push(...chunck);
}

let part1 = "";
for (let val of state.keys()) {
    part1 += state.get(val).pop();
}
console.log(part1);
