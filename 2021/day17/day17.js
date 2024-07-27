const fs = require("fs");
const { runMain } = require("module");
const text = fs.readFileSync("input.txt").toString();

let [_, xMin, xMax, yMin, yMax] = text.match(
    /target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/
);

console.log((Number(yMin) * (Number(yMin) + 1)) / 2);

// there is going to be an absolute minimum x, to find this, ramp up the y value and step through x until you find there it hits (this is because, given enough height, x values will always condense into a straight line downward )
// we can atttempt to step through, for each x after the absolute minimum, increment y value until it no longer hits the target area. This is the max y for that x.
// attempt for the next x, starting with previous y
// once the max value starts to fall, you can conssider the current max the answer as the apex has been reached

function hits(x, y) {
    return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
}

function overshoot(x, y) {
    return x > xMax || y < yMin;
}

function run(velX, velY) {
    let x = 0,
        y = 0,
        i = 0;
    positions = [];

    while (true) {
        i++;
        x += velX;
        y += velY;

        if (velX > 0) {
            velX--;
            0;
        }
        if (velX < 0) {
            velX++;
        }
        velY--;

        let hit = hits(x, y);
        let overshot = overshoot(x, y);
        positions.push({
            num: i,
            position: [x, y],
            hit,
            overshot,
        });

        if (hits(x, y)) {
            break;
        }
        if (overshoot(x, y)) {
            break;
        }
    }

    return positions;
}

function part1() {
    // find the minimum x val that is known to hit it, using y = yMin (y will always fall on 0 coming back down, so y = yMin will ensure that one fo the probes makes it to y = -yMin)
    let testY = (Number(yMin) + 1) * -1;
    let minXThing = null;
    for (let x = 1; x < xMax; x++) {
        positions = run(x, testY);
        // if any positions hit,
        if (positions.find((x) => x.hit)) {
            minXThing = x;
            break;
        }
    }

    // first iteration max = 9
    let maxOverallY = null;
    for (let x = minXThing; x < Number(xMax); x++) {
        let y = 0;
        let maxY = 0;

        while (true) {
            positions = run(x, y);

            if (maxY && !positions.find((x) => x.hit)) {
                break;
            }

            // it hits, figure out highest probe
            probeHits = positions.sort((a, b) => b.position[1] - a.position[1]);
            if (probeHits.length > 0) {
                test = probeHits[0].position[1];
                if (!maxY || maxY < test) {
                    maxY = test;
                }
                // if (test < maxY) {
                //     break;
                // }
            }
            y++;
        }
        if (maxOverallY < maxY) {
            maxOverallY = maxY;
        }
        // increment y until we start to miss
    }

    console.log(maxOverallY);
}

part1();
