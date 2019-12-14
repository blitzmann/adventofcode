const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n');

const tuple = require("immutable-tuple").tuple;

// const coords = [];

// for (let y = 0; y < input.length; y++) {

//     for (let x = 0; x < input[y].length; x++) {
//         const value = input[y][x];
//         if (value === "#") {
//             coords.push(tuple(x, y))
//         }
//     }
// }

// let maxNum = 0;
// let miningStation;
// for (let coord1 of coords) {
//     let num = 0
//     for (let coord2 of coords) {
//         // determine line
//         if (coord1 === coord2) { continue; }
//         let canSee = true;
//         for (let coord3 of coords) {
//             if (coord3 === coord1 || coord3 === coord2) { continue; }
//             const checkX = (coord3[0] - coord1[0]) / (coord2[0] - coord1[0]) // x is the same
//             const checkY = (coord3[1] - coord1[1]) / (coord2[1] - coord1[1]) // y is the same
//             let blocked = false
//             if (isNaN(checkX)) {
//                 // check to see if coord3 is closer
//                 if (coord1[1] > coord2[1]) {
//                     blocked = coord3[1] > coord2[1] && coord3[1] < coord1[1]
//                 } else {
//                     blocked = coord3[1] < coord2[1] && coord3[1] > coord1[1]
//                 }
//             }
//             if (isNaN(checkY)) {
//                 // check to see if coord3 is closer
//                 if (coord1[0] > coord2[0]) {
//                     blocked = coord3[0] > coord2[0] && coord3[0] < coord1[0]
//                 } else {
//                     blocked = coord3[0] < coord2[0] && coord3[0] > coord1[0]
//                 }
//             }
//             if ((checkX == checkY && checkX > 0 && checkX < 1)) {
//                 // something is blocking
//                 blocked = true
//             }
//             if (blocked) {
//                 canSee = false;
//                 break;
//             }
//         }

//         if (canSee) {
//             num++;
//         }
//     }
//     if (num > maxNum) {
//         maxNum = num;
//         miningStation = coord1;
//     }
// }

// console.log(`Part 1: ${maxNum}`)

function slope(c1, c2) {
    return (c2[1] - c1[1]) / (c2[0] - c1[0])
}

function distance(c1, c2) {
    return Math.sqrt(Math.pow(c2[0] - c1[0], 2) + Math.pow(c2[1] - c1[1], 2))
}

function getQuadrant(c1, c2) {
    if (c2[1] > c1[1] && c2[0] >= c1[0]) {
        return 1;
    }
    if (c2[1] <= c1[1] && c2[0] > c1[0]) {
        return 2;
    }
    if (c2[1] < c1[1] && c2[0] <= c1[0]) {
        return 3;
    }
    if (c2[1] >= c1[1] && c2[0] < c1[0]) {
        return 4;
    }
}

coords = [
    tuple(5, 6),
    tuple(7, 7),
    tuple(7, 4),
    tuple(8, 5),
    tuple(8, 2),
    tuple(7, 0),
    tuple(8, -1),
    tuple(3, 0),
    tuple(0, 0),
    tuple(1, 2),
    tuple(2, 4),
    tuple(6, -3),
    tuple(2, 6)
]
miningStation = tuple(5, 2)
const coordsCopy = coords.slice(0)

const data = [];
//iterate over coordinates to get slope with respect to mining station
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

quadSort = new Map([
    [1, (a, b) => ((a < b) ? 1 : -1)],
    [2, (a, b) => ((a < b) ? 1 : -1)],
    [3, (a, b) => ((a > b) ? 1 : -1)],
    [4, (a, b) => ((a > b) ? 1 : -1)]
])

// todo: loop through and modulo to get the quad number
quadNum = 1;

quad = data.filter(d => d[1] == quadNum);
set = new Set(quad.map(q => q[2]))

sortedSlopes = Array.from(set).sort(quadSort.get(quadNum))
console.log(sortedSlopes)
for (let slope of sortedSlopes) {
    // for each slope, get the one with the minimum distance
    coord = quad.sort((a, b)=>{
        return a[3] > b[3] ? 1 : -1
    }).find(q => q[2] == slope)[0]
    // get rid of coord from the coors copy
    console.log(coord)
}

console.log()
