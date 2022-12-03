const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");

result = lines.map((line) => {
    let index = line.length / 2;
    let [one, two] = [
        new Set(line.slice(0, index).split("")),
        new Set(line.slice(index).split("")),
    ];

    intersection = [...new Set([...one].filter((x) => two.has(x)))];
    charCode = intersection[0].charCodeAt(0);
    if (charCode >= "a".charCodeAt(0)) {
        charCode -= 96;
    } else {
        charCode = charCode - 96 + 26 + 26 + 6;
    }
    return charCode;
});

console.log(result);
console.log(result.reduce((a, b) => a + b, 0));

function groupArr(data, n) {
    var group = [];
    for (var i = 0, j = 0; i < data.length; i++) {
        if (i >= n && i % n === 0) j++;
        group[j] = group[j] || [];
        group[j].push(data[i]);
    }
    return group;
}

groups = groupArr(lines, 3);

part2 = groups.map((group) => {
    set1 = new Set(group[0]);
    set2 = new Set(group[1]);
    set3 = new Set(group[2]);

    intersection = new Set([...set1].filter((x) => set2.has(x)));
    intersection = [...new Set([...intersection].filter((x) => set3.has(x)))];

    charCode = intersection[0].charCodeAt(0);
    if (charCode >= "a".charCodeAt(0)) {
        charCode -= 96;
    } else {
        charCode = charCode - 96 + 26 + 26 + 6;
    }
    return charCode;
});

console.log(part2.reduce((a, b) => a + b, 0));
