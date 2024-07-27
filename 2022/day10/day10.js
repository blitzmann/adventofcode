const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");

function* lineIterator() {
    for (let line of lines) {
        let [cmd, num] = line.split(" ");
        yield [cmd === "noop" ? 1 : 2, cmd, +num];
    }
}

const it = lineIterator();

let register = 1;
let cycles = 1;
let part1 = 0;
let crtLine = "";
let crt = "";

while (true) {
    let result = it.next();
    if (result.done) {
        break;
    }

    let [t, cmd, num] = result.value;
    const end = cycles + t;

    while (cycles < end) {
        if (cycles === 20 || (cycles - 20) % 40 === 0) {
            part1 += cycles * register;
        }

        let currCrtPixel = (cycles % 40) - 1;
        if (currCrtPixel >= register - 1 && currCrtPixel <= register + 1) {
            crtLine += "#";
        } else {
            crtLine += ".";
        }

        if (cycles % 40 === 0) {
            crt += crtLine + "\n";
            crtLine = "";
        }

        cycles += 1;
    }
    if (cmd === "addx") {
        register += num;
    }
}

console.log("part 1: ", part1);
console.log(crt);
