const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const manDistance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
sensors = [];
for (let line of text.split("\r\n")) {
    const regex =
        /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/gims;
    m = regex.exec(line);
    let [_, sX, sY, bX, bY] = m;
    sensors.push({
        sensor: { x: +sX, y: +sY },
        beacon: { x: +bX, y: +bY },
        distance: manDistance(+sX, +sY, +bX, +bY),
    });
}

function part1(y) {
    line = "";

    maxD = Math.max(...sensors.map((x) => x.distance));
    maxX = Math.max(...sensors.map((x) => x.sensor.x)) + maxD;
    minX = Math.min(...sensors.map((x) => x.sensor.x)) - maxD;

    for (let x = minX; x < maxX; x++) {
        data = sensors.map((s) => {
            distanceToSensor = manDistance(x, y, s.sensor.x, s.sensor.y);
            if (s.beacon.x === x && s.beacon.y === y) {
                return null;
            }
            return s.distance >= distanceToSensor;
        });

        if (data.some((x) => x === null)) {
            line += "B";
        } else if (data.some(Boolean)) {
            line += "#";
        } else {
            line += ".";
        }
        // determine if we have
    }

    return line.split("").reduce((a, b) => (b === "#" ? a + 1 : a), 0);
}
console.time();

console.log("part 1", part1(2000000));
console.timeEnd();
// part2 - calculate boundaries of signals, and check +1 for one that doesn't ahve anything else
function* generatorPerimeter(point, d) {
    let [pX, pY] = point;
    for (
        let newX = pX - d, newY1 = pY, newY2 = pY, y = 0;
        newX <= pX + d;
        newX++
    ) {
        yield [newX, newY1];
        if (newY1 !== newY2) {
            yield [newX, newY2];
        }
        if (newX >= pX) {
            y--;
        } else {
            y++;
        }
        newY1 = pY + y;
        newY2 = pY - y;
    }
}

function checkPointWithinSensor(point) {
    let [x, y] = point;
    return sensors.some((s) => {
        distanceToSensor = manDistance(x, y, s.sensor.x, s.sensor.y);
        return s.distance >= distanceToSensor;
    });
}

function part2(maxBound) {
    max = maxBound;
    min = 0;
    for (let s of sensors) {
        for (let coord of generatorPerimeter(
            [s.sensor.x, s.sensor.y],
            s.distance + 1
        )) {
            let [x, y] = coord;

            if (x < min || x > max || y < min || y > max) {
                continue;
            }

            // we need to check this point against all other points.
            if (!checkPointWithinSensor(coord)) {
                return coord[0] * 4000000 + coord[1];
            }
        }
    }
}
console.time();
console.log("Part2", part2(4000000));
console.timeEnd();
