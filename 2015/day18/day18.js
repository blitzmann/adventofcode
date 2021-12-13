const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

grid = text.split("\r\n").map((x) =>
  x
    .trim()
    .split("")
    .map((x) => (x === "#" ? true : false))
);
const WIDTH = grid[0].length;
flatGrid = grid.flat(1);

CORNER_INDICIES = [
  0,
  WIDTH - 1,
  (grid.length - 1) * WIDTH,
  WIDTH * grid.length - 1,
];

function checkNeighbors(i) {
  y = [
    i - WIDTH, // top
    i + WIDTH, // down
  ];

  // not on right bounds
  if ((i + 1) % WIDTH !== 0) {
    y = [
      ...y,
      i + WIDTH + 1, // down right
      i - WIDTH + 1, //top right
      i + 1, // right
    ];
  }

  // not on the left bounds
  if (i % WIDTH !== 0) {
    y = [
      ...y,
      i - WIDTH - 1, // top left
      i + WIDTH - 1, // down left
      i - 1, // left
    ];
  }

  // y should now contain all indicies that need to be checked
  y = y.filter((x) => flatGrid[x]);

  // determine if we need to toggle it
  if (flatGrid[i] && !(y.length == 2 || y.length == 3)) {
    return true;
  }
  if (!flatGrid[i] && y.length == 3) {
    return true;
  }

  return false;
}

function step() {
  toggles = [];
  for (let i = 0; i < flatGrid.length; i++) {
    let toggle = checkNeighbors(i);
    if (toggle) {
      toggles.push(i);
    }
  }
  toggles.forEach((i) => (flatGrid[i] = !flatGrid[i]));
}

function printStep() {
  t = flatGrid
    .map((x, i) => {
      let t;
      if (x) {
        t = "#";
      } else {
        t = ".";
      }
      if ((i + 1) % WIDTH === 0) {
        t += "\n";
      }
      return t;
    })
    .join("");
  console.log(t + "\n\n");
}

for (let x = 0; x < 100; x++) {
  step();
  // printStep()
}

console.log(flatGrid.filter(Boolean).length);

flatGrid = grid.flat(1);
for (let i of CORNER_INDICIES) {
  flatGrid[i] = true;
}

for (let x = 0; x < 100; x++) {
  for (let i of CORNER_INDICIES) {
    flatGrid[i] = true;
  }
  step();
  for (let i of CORNER_INDICIES) {
    flatGrid[i] = true;
  }
  // printStep()
}
console.log(flatGrid.filter(Boolean).length);
