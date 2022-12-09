const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");

const grid = lines.map((x) => x.trim()).map((x) => x.split("").map(Number));
const gridRotated = grid[0].map((_, colIndex) =>
    grid.map((row) => row[colIndex])
);

const rotatedCoords = (x, y) => [y, x];

let innerVisible = 0;
// only need to calc the inner-portions, hence starting at 1 and going to length-1
for (let y = 1; y < grid.length - 1; y++) {
    for (let x = 1; x < grid[y].length - 1; x++) {
        console.log("=========");
        tree = grid[y][x];
        const [rX, rY] = rotatedCoords(x, y);
        console.log(tree);
        // check to see if it's visible from the x-axis
        const left = grid[y].slice(0, x);
        const right = grid[y].slice(x + 1);

        // use rotated grid to check y-axis
        const top = gridRotated[rY].slice(0, rX);
        const bottom = gridRotated[rY].slice(rX + 1);

        console.log(" left: ", !left.find((x) => x >= tree));
        console.log(" right: ", !right.find((x) => x >= tree));
        console.log(" top: ", !top.find((x) => x >= tree));
        console.log(" bottom: ", !bottom.find((x) => x >= tree));
        if (
            !left.find((x) => x >= tree) ||
            !right.find((x) => x >= tree) ||
            !top.find((x) => x >= tree) ||
            !bottom.find((x) => x >= tree)
        ) {
            innerVisible += 1;
        }
    }
}
console.log(innerVisible);
console.log(grid[0].length * 2 + gridRotated[0].length * 2 - 4);
console.log(
    "part 1:",
    innerVisible + grid[0].length * 2 + gridRotated[0].length * 2 - 4
);
