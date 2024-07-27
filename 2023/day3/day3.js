const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");
const matrix = lines.map((x) => x.split(""));
const isPartMatrix = lines.map((x) => x.split("").map((x) => null));

let totalSum = 0;
for (let i = 0; i < lines.length; i++) {
    let re = /\d+/g,
        line = lines[i];
    while ((match = re.exec(line)) != null) {
        // got a number at match.index
        console.log("match found at " + match.index);
        console.log("Num " + match[0]);
        let numLength = match[0].length;
        let startingX = Math.max(match.index - 1, 0);
        let endingX = Math.min(line.length - 1, match.index + numLength);
        let partNumber = false;
        if (i !== 0) {
            // check the top row if we're not already on the top row
            for (let start = startingX, end = endingX; start <= end; start++) {
                let test = matrix[i - 1][start];
                if (test !== "." && isNaN(+test)) {
                    partNumber = true;
                    break;
                }
            }
        }
        if (i !== lines.length - 1) {
            // check the bottom row if we're not already on the top row
            for (let start = startingX, end = endingX; start <= end; start++) {
                let test = matrix[i + 1][start];
                if (test !== "." && isNaN(+test)) {
                    partNumber = true;
                    break;
                }
            }
        }

        // check left
        let test = matrix[i][startingX];
        if (test !== "." && isNaN(+test)) {
            partNumber = true;
        }
        // check right
        test = matrix[i][endingX];
        if (test !== "." && isNaN(+test)) {
            partNumber = true;
        }

        if (partNumber) {
            totalSum += +match[0];
            // flag the parts for part 2
            for (let j = match.index; j < match.index + numLength; j++) {
                isPartMatrix[i][j] = +match[0];
            }
        }
    }
}
console.log(totalSum);
totalSum = 0;
function testArrayOfParts(test) {
    return [...new Set(test.filter(Boolean))];
    // switch (test.map().filter(Boolean).length) {
    //     case 3:
    //     case 1:
    //         return 1;
    //         break;
    //     case 2:
    //         // need to determine if they are contiguous
    //         if (!test[1]) {
    //             // if this is false, then the top row has a split, and this should count as two part numbers, true false true
    //             return 2;
    //         }
    //         // otherwise the paerts are in the first and middle, or middle and end. cound them as one
    //         return 1;
    //     default:
    //         break;
    // }
}
for (let i = 0; i < lines.length; i++) {
    let re = /\*/g,
        line = lines[i];
    while ((match = re.exec(line)) != null) {
        // got a number at match.index

        let start = Math.max(match.index - 1, 0);
        let end = Math.min(line.length - 1, match.index + 1);

        let adjacentParts = [];
        if (i !== 0) {
            // check the top row if we're not already on the top row
            // slice the isPartMatrix to determine if we have 0, 1, or 2 parts
            let test = isPartMatrix[i - 1].slice(start, end + 1);
            adjacentParts.push(...testArrayOfParts(test));
        }
        // bottom
        if (i !== lines.length - 1) {
            let test = isPartMatrix[i + 1].slice(start, end + 1);
            adjacentParts.push(...testArrayOfParts(test));
        }

        // check left
        let test = [isPartMatrix[i][start]];
        adjacentParts.push(...testArrayOfParts(test));

        // check right
        test = [isPartMatrix[i][end]];
        adjacentParts.push(...testArrayOfParts(test));

        if (adjacentParts.length === 2) {
            totalSum += adjacentParts.reduce((a, b) => a * b, 1);
        }
    }
}

console.log(totalSum);
