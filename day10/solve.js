const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n');

const tuple = require("immutable-tuple").tuple;

const coords = []; // defines coordinates of the asteroids

for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
        const value = input[y][x];
        if (value === "#") {
            coords.push(tuple(x, y))
        }
    }
}

let maxNum = 0;
let miningStation;
for (let coord1 of coords) { // coord1 is the asteroid we're testing for the mining station
    let num = 0
    for (let coord2 of coords) { // coord2 is the asteroid that we are testing to see if we have direct line of sight
        // determine line
        if (coord1 === coord2) { continue; }
        let canSee = true;
        for (let coord3 of coords) { // coord3 is an asteroid used to test if  there's another asteroid in the way.
            if (coord3 === coord1 || coord3 === coord2) { continue; }
            // these are variables whichj determin if the point we're checking lies on on of the same axis. 
            // If this is the case, we have to do a special calculation to check to see if the block test asteroid is "closer" to our coord1 than coord2
            const checkX = (coord3[0] - coord1[0]) / (coord2[0] - coord1[0]) // x is the same
            const checkY = (coord3[1] - coord1[1]) / (coord2[1] - coord1[1]) // y is the same
            let blocked = false
            if (isNaN(checkX)) {
                // check to see if coord3 is closer
                if (coord1[1] > coord2[1]) {
                    blocked = coord3[1] > coord2[1] && coord3[1] < coord1[1]
                } else {
                    blocked = coord3[1] < coord2[1] && coord3[1] > coord1[1]
                }
            }
            if (isNaN(checkY)) {
                // check to see if coord3 is closer
                if (coord1[0] > coord2[0]) {
                    blocked = coord3[0] > coord2[0] && coord3[0] < coord1[0]
                } else {
                    blocked = coord3[0] < coord2[0] && coord3[0] > coord1[0]
                }
            }

            // if not on the same axis, this nifty calculation checks to see if the block test asteroid lies directly between coord1 and coord2
            if ((checkX == checkY && checkX > 0 && checkX < 1)) {
                blocked = true
            }

            if (blocked) {
                canSee = false;
                break;
            }
        }

        if (canSee) {
            num++;
        }
    }
    if (num > maxNum) {
        maxNum = num;
        miningStation = coord1;
    }
}

console.log(`Part 1: ${maxNum}`)

/*
 * A note on how I approached part 2:
 * The radial scan is basically a line from the mining station outward. This can be represented by calculating a 
 * slope for each asteroid respective tot he mining station. When starting the "scan", we get all asteroids in the 
 * first quadrant and sort properly by their calculated slope. For the first quadrant, this means going from 
 * steepest slope -> no slope. For the Second quarant, the opposite, repeat for quadrant 3 and 4. Sortiung by slope 
 * effectively represents the next asteroid that is hit by the radial "scan". After that, I simple get all asteroids 
 * on that slope and get the closest one
 */

function slope(c1, c2) {
    // we use abs here due to issue with Infinity / -Infinity slope not matching correctly with other slopes in the quadrant
    // we don't need to know the true slope, we simply use this to sort on to determine the next point to check
    return Math.abs((c2[1] - c1[1]) / (c2[0] - c1[0]))
}

function distance(c1, c2) {
    return Math.sqrt(Math.pow(c2[0] - c1[0], 2) + Math.pow(c2[1] - c1[1], 2))
}

function getQuadrant(c1, c2) {
    if (c2[1] < c1[1] && c2[0] >= c1[0]) {
        return 0;
    }
    if (c2[1] >= c1[1] && c2[0] > c1[0]) {
        return 1;
    }
    if (c2[1] > c1[1] && c2[0] <= c1[0]) {
        return 2;
    }
    if (c2[1] <= c1[1] && c2[0] < c1[0]) {
        return 3;
    }
}

const data = [];
//iterate over coordinates to get calculations with respect to mining station
for (let coord of coords) {
    if (miningStation === coord) { continue; }
    // console.log(slope(miningStation, coord))
    data.push(tuple(
        coord,
        getQuadrant(miningStation, coord),
        slope(miningStation, coord),
        distance(miningStation, coord)
    ))
}

// starting from y-axis and going clockwise. Defines the sort for slopes per quadrant
const quadSort = new Map([
    [0, (a, b) => (a < b ? 1 : -1)],
    [1, (a, b) => (a > b ? 1 : -1)],
    [2, (a, b) => (a < b ? 1 : -1)],
    [3, (a, b) => (a > b ? 1 : -1)]
])

let q = 0; // the number of times we've gone over a quadrant threshold
let t = 200; // how many asteroids to vaporize before reporting result

function doScan() {
    while (true) {
        quadNum = q % 4;

        // get the asteroids in the quardrant
        quad = data.filter(d => d[1] == quadNum);

        // get the distinct slopes, sorted correctly based on the quadrant
        sortedSlopes = [... new Set(quad.map(q => q[2]))].sort(quadSort.get(quadNum))

        for (let slope of sortedSlopes) {
            // for each slope, get the one with the minimum distance
            t--;
            const coord = quad.sort((a, b) => {
                return a[3] > b[3] ? 1 : -1
            }).find(q => q[2] == slope)[0]

            if (t === 0) {
                return coord;
            }

            // get rid of coord from the data array
            dataItem = data.find(d => d[0] == coord)
            data.splice(data.indexOf(dataItem), 1)
        }
        q++
    }
}

const winningBet = doScan();

console.log(`Part 2: ${(winningBet[0] * 100) + winningBet[1]}`)
