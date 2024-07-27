const fs = require("fs");
const { consumers } = require("stream");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");

fullyContained = 0;
for (let line of lines) {
    let [elf1, elf2] = line.split(",").map((x) => x.split("-").map(Number));

    if (
        (elf1[0] >= elf2[0] && elf1[1] <= elf2[1]) ||
        (elf2[0] >= elf1[0] && elf2[1] <= elf1[1])
    ) {
        fullyContained += 1;
    }
}
console.log(fullyContained);

overlap = 0;
for (let line of lines) {
    let [elf1, elf2] = line.split(",").map((x) => x.split("-").map(Number));

    // create sets with the ranges
    elf1 = new Set(
        Array.from({ length: elf1[1] - elf1[0] + 1 }, (_, i) => i + elf1[0])
    );
    elf2 = new Set(
        Array.from({ length: elf2[1] - elf2[0] + 1 }, (_, i) => i + elf2[0])
    );

    // find any intersections
    if ([...new Set([...elf1].filter((x) => elf2.has(x)))].length > 0) {
        overlap += 1;
    }
}
console.log(overlap);
