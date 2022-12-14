const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const coords = text
    .split("\r\n")
    .map((x) => x.split("->").map((x) => x.split(",").map(Number)));

console.log(coords);
xValues = coords.map((x) => x.map((x) => x[0])).flat();
yValues = coords.map((x) => x.map((x) => x[1])).flat();

function makeArray(d1, d2) {
    var arr = new Array(d1),
        i,
        l;
    for (i = 0, l = d2; i < l; i++) {
        arr[i] = new Array(d1);
    }
    return arr;
}

let field = new Map();

function generatMap(coords) {
    for (let coord of coords) {
        for (let i = 0; i < coord.length - 1; i++) {
            from = coord[i];
            to = coord[i + 1];
            const c = from[0] === to[0] ? 1 : 0; // vert / hor

            for (
                let j = Math.min(from[c], to[c]), k = from[Math.abs(c - 1)];
                j <= Math.max(from[c], to[c]);
                j++
            ) {
                if (c === 1) {
                    field.set(`X${k}Y${j}`, { x: k, y: j, c: "#" });
                } else {
                    field.set(`X${j}Y${k}`, { x: j, y: k, c: "#" });
                }
            }
        }
    }
}
generatMap(coords);

const maxY = Math.max(...[...field.values()].map((x) => x.y));

function sandFall() {
    x = 500;
    y = 0;

    // todo: while (!isResting) ?
    while (true) {
        if (y > maxY + 10) {
            return false;
        }
        // check below.
        key = `X${x}Y${y + 1}`;
        content = field.get(key);
        if (!content) {
            // nothing below, keep falling
            y++;
        } else {
            // something is below
            // check diagonal to the left
            if (!field.get(`X${x - 1}Y${y + 1}`)) {
                x--;
                y++;
                continue;
                // keep falling
            }
            if (!field.get(`X${x + 1}Y${y + 1}`)) {
                x++;
                y++;
                continue;
                // keep falling
            }
            // rest
            field.set(`X${x}Y${y}`, { x, y, c: "o" });
            break;
        }
    }
}

while (sandFall() !== false) {}
console.log([...field.values()].filter((x) => x.c === "o").length);
