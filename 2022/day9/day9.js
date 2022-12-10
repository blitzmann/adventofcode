const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");

// let head = [0, 0];
// let tail = [0, 0];
// const tailPoints = new Set();

const calculateDistance = (a, b) => {
    return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
};

// for (let line of lines) {
//     let [dir, num] = line.split(" ");

//     }
// }

// console.log(tailPoints.size);

// part 2

class Rope {
    constructor(size) {
        this.segments = Array(size)
            .fill()
            .map((_) => [0, 0]);
        this.size = size;
        this.tailPoints = new Set();
    }

    calc(dir, num) {
        for (let i = 0; i < +num; i++) {
            for (let j = 0; j < this.size - 1; j++) {
                let head = this.segments[j];
                let tail = this.segments[j + 1]; // "tail" in the context of these two segments
                if (j === 0) {
                    if (dir === "U") {
                        this.segments[j] = [head[0], head[1] + 1];
                    }
                    if (dir === "D") {
                        this.segments[j] = [head[0], head[1] - 1];
                    }
                    if (dir === "R") {
                        this.segments[j] = [head[0] + 1, head[1]];
                    }
                    if (dir === "L") {
                        this.segments[j] = [head[0] - 1, head[1]];
                    }
                }
                if (
                    calculateDistance(this.segments[j], this.segments[j + 1]) >
                    1
                ) {
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
            }
            // console.log("==== " + dir + i + " ====");
            // console.log("head: ", head);
            // console.log("tail: ", tail);

            this.tailPoints.add(`X${this.tail[0]}Y${this.tail[1]}`);
        }
    }

    get head() {
        return this.segments[0];
    }
    get tail() {
        return this.segments[this.size - 1];
    }
}

const rope = new Rope(9);
for (let line of lines) {
    let [dir, num] = line.split(" ");
    rope.calc(dir, +num);
}

console.log(rope.tailPoints, rope.tailPoints.size);
