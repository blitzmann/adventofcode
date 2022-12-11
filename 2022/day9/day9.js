const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");

let head = [0, 0];
let tail = [0, 0];
const tailPoints = new Set();

const calculateDistance = (a, b) => {
    return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
};

function printState() {
    // find min / max of grid
    let minX = 0;
    let maxX = 6;
    let minY = 0;
    let maxY = 6;

    for (let y = maxY; y >= minY; y--) {
        let line = "";
        for (let x = minX; x <= maxX; x++) {
            if (head[0] === x && head[1] === y) {
                line += "H";
            } else if (tail[0] === x && tail[1] === y) {
                line += "T";
            } else if (y === 0 && x === 0) {
                line += "s";
            } else {
                line += ".";
            }
        }
        console.log(line);
    }
}

for (let line of lines) {
    let [dir, num] = line.split(" ");
    for (let i = 0; i < +num; i++) {
        console.log(`== ${dir} ${i + 1}/${num} ==`);
        if (dir === "U") {
            head = [head[0], head[1] + 1];
        }
        if (dir === "D") {
            head = [head[0], head[1] - 1];
        }
        if (dir === "R") {
            head = [head[0] + 1, head[1]];
        }
        if (dir === "L") {
            head = [head[0] - 1, head[1]];
        }

        if (calculateDistance(head, tail) > 1) {
            if (dir === "U" || dir === "D") {
                tail[0] = head[0];
            } else {
                tail[1] = head[1];
            }

            if (dir === "U") {
                tail[1] = head[1] - 1;
            }
            if (dir === "D") {
                tail[1] = head[1] + 1;
            }
            if (dir === "R") {
                tail[0] = head[0] - 1;
            }
            if (dir === "L") {
                tail[0] = head[0] + 1;
            }
        }
        // console.log("==== " + dir + i + " ====");
        // console.log("head: ", head);
        // console.log("tail: ", tail);

        tailPoints.add(`X${tail[0]}Y${tail[1]}`);
        printState();
    }
}

console.log(tailPoints.size);
