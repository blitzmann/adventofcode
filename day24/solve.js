const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();
const flatten = require("array-flatten");


const layout = new Set();

const inputLines = input.split('\n').map(x => x.split(''));

// function buildLayout() {
//     for (let y = 0; y < inputLines.length; y++) {
//         let line = "";
//         for (let x = 0; x < inputLines[y].length; x++) {
//             line += inputLines[y][x]
//         }
//         console.log(line);
//     }
// }

// function checkAdjacent(x, y) {
//     // check the four adjacents
//     let num = 0;
//     if (inputLines[y - 1]) {
//         num += inputLines[y - 1][x] === "#" ? 1 : 0;
//     }
//     if (inputLines[y + 1]) {
//         num += inputLines[y + 1][x] === "#" ? 1 : 0;
//     }
//     num += inputLines[y][x - 1] === "#" ? 1 : 0;
//     num += inputLines[y][x + 1] === "#" ? 1 : 0;
//     return num;
// }

// function getAllIndexes(arr, val) {
//     var indexes = [], i;
//     for (i = 0; i < arr.length; i++)
//         if (arr[i] === val)
//             indexes.push(i);
//     return indexes;
// }

// while (true) {
//     const toggles = [];
//     for (let y = 0; y < inputLines.length; y++) {
//         for (let x = 0; x < inputLines[y].length; x++) {
//             const neighbors = checkAdjacent(x, y);
//             if (inputLines[y][x] === "#" && neighbors !== 1) {
//                 // A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
//                 toggles.push([x, y])
//             }
//             else if (inputLines[y][x] === "." && (neighbors === 1 || neighbors === 2)) {
//                 // An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
//                 toggles.push([x, y])
//             }
//         }
//     }

//     for (let [x, y] of toggles) {
//         inputLines[y][x] = inputLines[y][x] === "#" ? "." : "#"
//     }

//     const dna = flatten.flatten(inputLines).join('');
//     if (layout.has(dna)) {
//         const indicies = getAllIndexes(Array.from(dna), "#");
//         const bioRating = indicies.reduce((u, i) => u + Math.pow(2, i), 0);
//         console.log(`Part 1: ${bioRating}`)
//         break;
//     }

//     layout.add(dna)
// }


// Part 2

const gridRegister = []

class Grid {
    constructor(level, initialState) {
        this.level = level
        if (!initialState) {
            initialState = Array(5).fill().map(() => new Array(5).fill('.'));
        }
        this.state = initialState;
        gridRegister.push(this);
        this.pendingToggles = []
    }

    checkAdjacent(x, y) {
        // check the four adjacents
        // top
        let num = 0;
        if (y === 0) {
            // first line, thus need to check the parent grid, which will always be x=2, y=1
            num += !this.parent ? 0 : (this.parent.state[1][2] === "#" ? 1 : 0);
        } else if (y == 3 && x === 2) {
            // check the child grid's last row
            num += !this.child ? 0 : this.child.state[4].filter(x=>x === "#").length
        } else {
            num += inputLines[y - 1][x] === "#" ? 1 : 0;
        }

        // bottom
        if (y === 4) {
            // last line, thus need to check the parent grid, which will always be x=2, y=3
            num += !this.parent ? 0 : (this.parent.state[3][2] === "#" ? 1 : 0);
        } else if (y === 1 && x === 2) {
            // check child grids top row
            num += !this.child ? 0 : this.child.state[0].filter(x=>x === "#").length
        }
        else {
            num += inputLines[y + 1][x] === "#" ? 1 : 0;
        }    

        // right 
        if (x === 4) {
            // check parent
            num += !this.parent ? 0 : (this.parent.state[2][3] === "#" ? 1 : 0);
        } else if (x ===1 && y == 2){
            // check child
            num += !this.child ? 0 : this.child.state.filter(x=>x[0] === "#").length
        } else {
            num += inputLines[y][x + 1] === "#" ? 1 : 0;    
        }

        // left
        if (x === 0) {
            // check parent
            num += !this.parent ? 0 : (this.parent.state[2][1] === "#" ? 1 : 0);
        } else if (x ===3 && y == 2){
            // check child
            num += !this.child ? 0 : this.child.state.filter(x=>x[4] === "#").length
        } else {    
            num += inputLines[y][x - 1] === "#" ? 1 : 0;
        }
        
        return num;
    }

    run() {
        if (!this.isEmpty) {
            // we have a non-empty grid, meaning what we have here may affect the parent / child. Need to 
            if (!this.child) {
                this.child = new Grid(this.level + 1);
                this.child.parent = this; // ugh
            }
            if (!this.parent) {
                this.parent = new Grid(this.level - 1);
                this.parent.child = this; 
            }
        }

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                if (y === 2 && x === 2) {
                    continue; // middle of the grid
                }
                const neighbors = this.checkAdjacent(x, y);
                if (this.state[y][x] === "#" && neighbors !== 1) {
                    // A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
                    this.pendingToggles.push([x, y])
                }
                else if (this.state[y][x] === "." && (neighbors === 1 || neighbors === 2)) {
                    // An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
                    this.pendingToggles.push([x, y])
                }
            }
        }
    }

    commit() {
        for (let [x, y] of this.pendingToggles) {
            this.state[y][x] = this.state[y][x] === "#" ? "." : "#"
        }
    }

    get isEmpty() {
        return flatten.flatten(this.state).filter(x => x === '#').length === 0
    }
}

const levels = new Map();

// initialize level 0 to 
const level0 = new Grid(0, input.split('\n').map(x => x.trim().split('')))



const minutesToCheck = 10

for (let min = 0; min < minutesToCheck; min++) {
    const grids = gridRegister.slice() // copy so that any subsequent additions don't get in the way this run
    for (var grid of grids) {
        grid.run();
    }

    for (var grid of grids) {
        grid.commit();
    }
}
var sorted = gridRegister.sort((a, b) => a.level > b.level ? 1 : -1)
for (let grid of sorted){
    console.log()
    console.log(`Grid ${grid.level}`)
    for (let y = 0; y < grid.state.length; y++) {
        let line = "";
        for (let x = 0; x < grid.state[y].length; x++) {
            line += grid.state[y][x]
        }
        console.log(line);
    }
}


