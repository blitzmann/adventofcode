const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

let input = text.split("\r\n").map((x) => x.trim().split("").map(Number));

let WIDTH = input[0].length;
let grid = input.flat(1);

// I, once afgain, had to lookup which path finding to use. :/
// https://reginafurness.medium.com/dijkstras-algorithm-in-javascript-4b5db48a93d4
function neighbors(i) {
  y = [
    i - WIDTH, // top
    i + WIDTH, // down
  ];

  // not on right bounds
  if ((i + 1) % WIDTH !== 0) {
    y.push(i + 1); // right
  }

  // not on the left bounds
  if (i % WIDTH !== 0) {
    y.push(i - 1); // left
  }

  return y.filter((x) => x >= 0 && x < grid.length);
}

class Graph {
  constructor() {
    this.vertices = [];
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    this.vertices.includes(vertex) ? null : this.vertices.push(vertex);
    if (this.adjacencyList[vertex] === undefined) {
      this.adjacencyList[vertex] = {};
    }
  }

  addEdge(vertex1, vertex2, weight) {
    this.adjacencyList[vertex1][vertex2] = weight;
  }

  dijkstra(source) {
    let distances = {},
      parents = {},
      visited = new Set();
    for (let i = 0; i < this.vertices.length; i++) {
      if (this.vertices[i] === source) {
        distances[source] = 0;
      } else {
        distances[this.vertices[i]] = Infinity;
      }
      parents[this.vertices[i]] = null;
    }

    let currVertex = this.vertexWithMinDistance(distances, visited);

    while (currVertex !== null) {
      let distance = distances[currVertex],
        neighbors = this.adjacencyList[currVertex];
      for (let neighbor in neighbors) {
        let newDistance = distance + neighbors[neighbor];
        if (distances[neighbor] > newDistance) {
          distances[neighbor] = newDistance;
          parents[neighbor] = currVertex;
        }
      }
      visited.add(currVertex);
      currVertex = this.vertexWithMinDistance(distances, visited);
    }

    return [parents, distances];
  }
  vertexWithMinDistance(distances, visited) {
    let minDistance = Infinity,
      minVertex = null;
    for (let vertex in distances) {
      let distance = distances[vertex];
      if (distance < minDistance && !visited.has(vertex)) {
        minDistance = distance;
        minVertex = vertex;
      }
    }
    return minVertex;
  }
}

let graph = new Graph();

for (let i = 0; i < grid.length; i++) {
  let neighborsIndicies = neighbors(i);

  [i, ...neighborsIndicies].forEach((x) => graph.addVertex(x));
  neighborsIndicies.forEach((x) => graph.addEdge(i, x, grid[x]));
}

let [parents, distances] = graph.dijkstra(0);
console.log(distances[grid.length - 1]);

// ----- part 2

newGrid = [];
for (let bigRow = 0; bigRow < 5; bigRow++) {
  for (let bigCol = 0; bigCol < 5; bigCol++) {
    // we use bigRow as a modifier
    let newChunk = input.map((y) =>
      y.map((x) => {
        // new value using just the increment of the row / col
        // can't use modulo because 0 isn't valid
        let newValue = x + bigRow + bigCol;
        return newValue > 9 ? newValue - 9 : newValue;
      })
    );
    newChunk.forEach((x, i) => {
      newGridRow = bigRow * input.length + i;
      if (!newGrid[newGridRow]) {
        newGrid[newGridRow] = [];
      }
      newGrid[newGridRow] = newGrid[newGridRow].concat(x);
    });
  }
}

WIDTH = newGrid[0].length;
grid = newGrid.flat(1);

graph = new Graph();

for (let i = 0; i < grid.length; i++) {
  let neighborsIndicies = neighbors(i);
  if (i % 10000 == 0) {
    console.log(i);
  }
  [i, ...neighborsIndicies].forEach((x) => graph.addVertex(x));
  neighborsIndicies.forEach((x) => graph.addEdge(i, x, grid[x]));
}

[parents, distances] = graph.dijkstra(0);
console.log(distances[grid.length - 1]);
