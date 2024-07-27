const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");

// stack overflow :D
function groupArr(data, n) {
    var group = [];
    for (var i = 0, j = 0; i < data.length; i++) {
        if (i >= n && i % n === 0) j++;
        group[j] = group[j] || [];
        group[j].push(data[i]);
    }
    return group;
}

function score(char) {
    // can't just use the char code for this, since the scoring take priority of lowercase
    charCode = char.charCodeAt(0);
    return (charCode -= charCode >= "a".charCodeAt(0) ? 96 : 38);
}

part1 = lines
    .map((line) => {
        let index = line.length / 2;
        let [one, two] = [
            new Set(line.slice(0, index).split("")),
            new Set(line.slice(index).split("")),
        ];

        intersection = [...new Set([...one].filter((x) => two.has(x)))];
        return score(intersection[0]);
    })
    .reduce((a, b) => a + b, 0);

console.log("Part 1: ", part1);

groups = groupArr(lines, 3);
part2 = groups
    .map((group) => {
        let intersection = new Set(group[0].split(""));
        for (let line of group.slice(1)) {
            intersection = new Set(
                [...intersection].filter((x) => new Set(line.split("")).has(x))
            );
        }

        intersection = [...intersection];

        return score(intersection[0]);
    })
    .reduce((a, b) => a + b, 0);

console.log("Part 2: ", part2);
