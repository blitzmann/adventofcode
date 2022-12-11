const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");

const grid = lines.map((x) => x.trim()).map((x) => x.split("").map(Number));
const gridRotated = grid[0].map((_, colIndex) =>
    grid.map((row) => row[colIndex])
);

let innerVisible = 0;
// only need to calc the inner-portions, hence starting at 1 and going to length-1
for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        tree = grid[y][x];
        // console.log("=====");
        // console.log(tree);
        // check to see if it's visible from the x-axis
        const left = grid[y].slice(0, x);
        const right = grid[y].slice(x + 1);

        // use rotated grid to check y-axis
        const top = grid.slice(0, y).map((y) => y[x]);
        const bottom = grid.slice(y + 1).map((y) => y[x]);

        if (
            !left.some((x) => x >= tree) ||
            !right.some((x) => x >= tree) ||
            !top.some((x) => x >= tree) ||
            !bottom.some((x) => x >= tree)
        ) {
            innerVisible += 1;
        }
    }
}
console.log("part 1:", innerVisible);

function* takeWhile(fn, arr) {
    for (let x of arr)
        if (fn(x)) {
            yield x;
        } else {
            yield x;
            break;
        }
}

let max = 0;
for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        tree = grid[y][x];
        const left = grid[y].slice(0, x).reverse();
        const right = grid[y].slice(x + 1);
        const top = grid
            .slice(0, y)
            .map((y) => y[x])
            .reverse();
        const bottom = grid.slice(y + 1).map((y) => y[x]);

        topScore = [...takeWhile((x) => x < tree, top)].length;
        leftScore = [...takeWhile((x) => x < tree, left)].length;
        rightScore = [...takeWhile((x) => x < tree, right)].length;
        bottomScore = [...takeWhile((x) => x < tree, bottom)].length;

        max = Math.max(max, topScore * leftScore * rightScore * bottomScore);
    }
}

console.log("part 2: ", max);
