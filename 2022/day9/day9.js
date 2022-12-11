const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");

const calculateDistance = (a, b) => {
    return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
};

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
            // console.log(`== ${dir} ${i + 1}/${num} ==`);
            for (let j = 0; j < this.size - 1; j++) {
                let head = this.segments[j];
                let tail = this.segments[j + 1]; // "tail" in the context of these two segments

                if (j === 0) {
                    if (dir === "U") {
                        this.segments[j][1] += 1;
                    }
                    if (dir === "D") {
                        this.segments[j][1] -= 1;
                    }
                    if (dir === "R") {
                        this.segments[j][0] += 1;
                    }
                    if (dir === "L") {
                        this.segments[j][0] -= 1;
                    }
                }
                if (
                    calculateDistance(this.segments[j], this.segments[j + 1]) >
                    1
                ) {
                    this.doPhysics(head, tail);
                }
            }

            this.tailPoints.add(`X${this.tail[0]}Y${this.tail[1]}`);
            // this.printState();
        }
    }

    get head() {
        return this.segments[0];
    }

    get tail() {
        return this.segments[this.size - 1];
    }

    doPhysics(head, tail) {
        // determine diagonal steps
        if (head[0] !== tail[0] && head[1] !== tail[1]) {
            if (head[0] > tail[0] && head[1] > tail[1]) {
                tail[0] += 1;
                tail[1] += 1;
            }
            if (head[0] < tail[0] && head[1] > tail[1]) {
                tail[0] -= 1;
                tail[1] += 1;
            }
            if (head[0] > tail[0] && head[1] < tail[1]) {
                tail[0] += 1;
                tail[1] -= 1;
            }
            if (head[0] < tail[0] && head[1] < tail[1]) {
                tail[0] -= 1;
                tail[1] -= 1;
            }
        } else if (head[1] > tail[1]) {
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

    printState() {
        // find min / max of grid
        let minX = -15;
        let maxX = 15;
        let minY = -18;
        let maxY = 18;

        for (let y = maxY; y >= minY; y--) {
            let line = "";
            for (let x = minX; x <= maxX; x++) {
                let v = this.segments.indexOf(
                    this.segments.find((z) => z[0] === x && z[1] === y)
                );
                if (v >= 0) {
                    if (v === 0) {
                        line += "H";
                    } else {
                        line += v.toString();
                    }
                } else if (y === 0 && x === 0) {
                    line += "s";
                } else {
                    line += ".";
                }
            }
            console.log(line + " " + y);
        }
    }
}

let rope = new Rope(2);
for (let line of lines) {
    let [dir, num] = line.split(" ");
    rope.calc(dir, +num);
}

console.log("part 1: ", rope.tailPoints.size);

rope = new Rope(10);
for (let line of lines) {
    let [dir, num] = line.split(" ");
    rope.calc(dir, +num);
}

console.log("part 2: ", rope.tailPoints.size);
