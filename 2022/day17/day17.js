const fs = require("fs");
const directions = fs.readFileSync("input.txt").toString().split("");
console.time();
const rocks = [
    {
        shape: [[1, 1, 1, 1]],
        shapeStr: "####",
    },
    {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
        ],
        shapeStr: ".#.\n###\n.#.",
    },
    {
        shape: [
            [1, 1, 1], // shapes are vertically mirrored for ease of calcs
            [0, 0, 1],
            [0, 0, 1],
        ],
        shapeStr: "..#\n..#\n###",
    },
    {
        shape: [[1], [1], [1], [1]],
        shapeStr: "#\n#\n#\n#",
    },
    {
        shape: [
            [1, 1],
            [1, 1],
        ],
        shapeStr: "##\n##",
    },
];

// add the floor, seven units wide
const column = new Map([
    ["X0Y0", { x: 0, y: 0, c: "-", rock: null }],
    ["X1Y0", { x: 1, y: 0, c: "-", rock: null }],
    ["X2Y0", { x: 2, y: 0, c: "-", rock: null }],
    ["X3Y0", { x: 3, y: 0, c: "-", rock: null }],
    ["X4Y0", { x: 4, y: 0, c: "-", rock: null }],
    ["X5Y0", { x: 5, y: 0, c: "-", rock: null }],
    ["X6Y0", { x: 6, y: 0, c: "-", rock: null }],
]);

let tallestY = 0;

// function takes in the reference point, the rock, and the direction, to determine which points need to be checked to see if there's anything blocking the shift in direction
// reference point is always going to be lower left corner of rock shape
function* generateCheckPoints(reference, rock, direction) {
    if (direction === "v") {
        // we're going down, check
        const usedX = new Set(); // instead of rotatign array, just store the x values we've already determined to have something under it
        for (let y = 0; y < rock.shape.length; y++) {
            for (let x = 0; x < rock.shape[0].length; x++) {
                if (!usedX.has(x) && rock.shape[y][x]) {
                    yield [reference[0] + x, reference[1] + (y - 1)];
                    usedX.add(x);
                }
            }
        }
    }
    if (direction === ">") {
        // we're going right, so get the right edge pieces
        for (let y = 0; y < rock.shape.length; y++) {
            for (let x = rock.shape[y].length - 1; x >= 0; x--) {
                if (rock.shape[y][x]) {
                    yield [reference[0] + x + 1, reference[1] + y];
                    break;
                }
            }
        }
    }
    if (direction === "<") {
        // we're going left, so get the left edge pieces
        for (let y = 0; y < rock.shape.length; y++) {
            for (let x = 0; x < rock.shape[y].length; x++) {
                if (rock.shape[y][x]) {
                    yield [reference[0] + (x - 1), reference[1] + y];
                    break;
                }
            }
        }
    }
}

function* generateRockPoints(reference, rock) {
    for (let y = 0; y < rock.shape.length; y++) {
        for (let x = 0; x < rock.shape[y].length; x++) {
            if (rock.shape[y][x]) {
                yield [reference[0] + x, reference[1] + y];
            }
        }
    }
}

function getMaxY(column) {
    return Math.max(...[...column.values()].map((x) => x.y));
}

function printMap(reference) {
    for (y = getMaxY(column) + 5; y >= 0; y--) {
        let line = "";
        for (x = 0; x < 7; x++) {
            if (reference[0] === x && reference[1] === y) {
                line += "x";
            } else {
                const data = column.get(`X${x}Y${y}`);
                line += data ? data.c : ".";
            }
        }
        console.log(line);
    }
    console.log();
}

states = new Map();
let addedHeight = 0;

const NUM_ROCKS = 1000000000000;
for (let iRock = 0, tick = 0; iRock < NUM_ROCKS; iRock++) {
    const rock = rocks[iRock % 5];
    let startingY = tallestY + 4; // leave 3 buffer between bottom of rock and top of column
    let reference = [2, startingY]; // reference point, this is what the wind will technically move, and we overlap the rock calcs utilizing this
    // printMap(reference);

    for (; ; tick++) {
        let direction = directions[tick % directions.length];
        shiftBlocked = [...generateCheckPoints(reference, rock, direction)]
            .map((p) => ({ key: `X${p[0]}Y${p[1]}`, point: p }))
            .map(
                (data) =>
                    column.has(data.key) ||
                    data.point[0] < 0 ||
                    data.point[0] >= 7
            )
            .some(Boolean);

        if (!shiftBlocked) {
            reference[0] += direction === ">" ? 1 : -1;
        }

        // check downward
        downBlocked = [...generateCheckPoints(reference, rock, "v")]
            .map((p) => `X${p[0]}Y${p[1]}`)
            .map((key) => column.has(key))
            .some(Boolean);

        if (downBlocked) {
            // need to rest, add shape to the column mapping and get new rock
            let rockPoints = [...generateRockPoints(reference, rock)];
            for (let p of rockPoints) {
                column.set(`X${p[0]}Y${p[1]}`, {
                    x: p[0],
                    y: p[1],
                    c: "#",
                    rock,
                });
            }
            tallestY = Math.max(...rockPoints.map((x) => x[1]), tallestY);
            tick += 1;
            break;
        }
        {
            reference[1] -= 1;
        }
        // printMap(reference);
    }

    // State section, after every rock we determine which tick we're on, which rock, and what the top 10 rows look like
    let state = `${tick % directions.length},${iRock % 5},`;
    for (let y = tallestY; y >= tallestY - 10; y--) {
        let rownum = "";
        for (let x = 0; x < 7; x++) {
            rownum += column.has(`X${x}Y${y}`) ? 1 : 0;
        }
        // binary!
        state += parseInt(rownum, 2) + ",";
    }

    let prevState = states.get(state);
    if (prevState) {
        // we have a previous state match, which means we have a cycle. Use this to extrapolate
        let rockDelta = iRock - prevState.count;
        let heightDelta = tallestY - prevState.height;
        let cycleAmount =
            Math.floor((NUM_ROCKS - prevState.count) / rockDelta) - 1;

        // don't change tallestY, because then the rock will start from there and will have to fall forever since we haven't actually calcuated all the in between.
        addedHeight += cycleAmount * heightDelta;
        iRock += cycleAmount * rockDelta;
    } else {
        states.set(state, { height: tallestY, count: iRock });
    }
}

console.log(tallestY + addedHeight);
console.timeEnd();
