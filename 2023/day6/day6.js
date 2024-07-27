const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

let times = lines[0].split(":")[1].trim().split(/\s+/).map(Number);
let distances = lines[1].split(":")[1].trim().split(/\s+/).map(Number);

function* determineWinningRaces(race) {
    let [time, target] = race;
    let reachedTarget = false;
    for (let t = 1; t <= time; t++) {
        let remainder = time - t;
        let total = remainder * t;
        if (total > target) {
            reachedTarget = true;
            yield total;
        } else if (reachedTarget) {
            return;
        }
    }
}

function calculateWinningRaces(race) {
    return [...determineWinningRaces(race)];
}

console.log(
    zip(times, distances)
        .map(calculateWinningRaces)
        .map((x) => x.length)
        .reduce((a, b) => a * b, 1)
);

times = +lines[0].split(":")[1].trim().replace(/\s+/g, "");
distances = +lines[1].split(":")[1].trim().replace(/\s+/g, "");

console.log(
    [[times, distances]]
        .map(calculateWinningRaces)
        .map((x) => x.length)
        .reduce((a, b) => a * b, 1)
);
