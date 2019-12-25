const fs = require('fs');
const path = require("path");
const inputLines = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n').map(x => x.split(''));
const flatten = require("array-flatten");


const layout = new Set();

function buildLayout() {
    for (let y = 0; y < inputLines.length; y++) {
        let line = "";
        for (let x = 0; x < inputLines[y].length; x++) {
            line += inputLines[y][x]
        }
        console.log(line);
    }
}

function checkAdjacent(x, y) {
    // check the four adjacents
    let num = 0;
    if (inputLines[y-1]) {
        num += inputLines[y-1][x] === "#" ? 1 : 0;
    }
    if (inputLines[y+1]) {
        num += inputLines[y+1][x] === "#" ? 1 : 0;
    }
    num += inputLines[y][x-1] === "#" ? 1 : 0;
    num += inputLines[y][x+1] === "#" ? 1 : 0;
    return num;
}

function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

while (true) {
    const toggles = [];
    for (let y = 0; y < inputLines.length; y++) {
        for (let x = 0; x < inputLines[y].length; x++) {
            const neighbors = checkAdjacent(x, y);
            if (inputLines[y][x] === "#" && neighbors !== 1) {
                // A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
                toggles.push([x, y])
            }
            else if (inputLines[y][x] === "." && (neighbors === 1 || neighbors === 2)) {
                // An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
                toggles.push([x, y])
            }
        }
    }

    for (let [x, y] of toggles) {
        inputLines[y][x] = inputLines[y][x] === "#" ? "." : "#"
    }

    const dna = flatten.flatten(inputLines).join('');
    if (layout.has(dna)) {
        const indicies = getAllIndexes(Array.from(dna), "#");
        const bioRating = indicies.reduce((u, i)=> u + Math.pow(2, i), 0);
        console.log(`Part 1: ${bioRating}`)
        break;
    }

    layout.add(dna)

}


