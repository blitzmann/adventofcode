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

function doPhysics(head, tail) {
    if (Math.abs(head[1] - tail[1]) > 1) {
        // the head has moved up or down, the tail is forced to be in the same column
        tail[0] = head[0];
    } else if (Math.abs(head[0] - tail[0]) > 1) {
        // the head has moved left or right, the tail is forced to be in the same row
        tail[1] = head[1];
    }

    if (head[1] > tail[1]) {
        // if head is above tail
        tail[1] = head[1] - 1;
    } else if (head[1] < tail[1]) {
        // if head is below tail
        tail[1] = head[1] + 1;
    } else if (head[0] < tail[0]) {
        // if head is left of tail
        tail[0] = head[0] + 1;
    } else if (head[0] > tail[0]) {
        // if head is right of tail
        tail[0] = head[0] - 1;
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
            doPhysics(head, tail);
        }
        // console.log("==== " + dir + i + " ====");
        // console.log("head: ", head);
        // console.log("tail: ", tail);

        tailPoints.add(`X${tail[0]}Y${tail[1]}`);
        printState();
    }
}

console.log(tailPoints.size);
