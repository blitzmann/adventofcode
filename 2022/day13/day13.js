const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const pairs = text.split("\r\n\r\n");

// reeturns true if in right order, false if not, and null if indeterminate
function compareList(leftList, rightList) {
    outOfOrder = false;

    for (let i = 0; i < Math.max(leftList.length, rightList.length); i++) {
        let leftVal = leftList[i];
        let rightVal = rightList[i];

        if (leftVal === undefined) {
            return true;
        }
        if (rightVal === undefined) {
            return false;
        }

        if (
            (typeof leftVal === "number" && Array.isArray(rightVal)) ||
            (typeof rightVal === "number" && Array.isArray(leftVal))
        ) {
            if (!Array.isArray(leftVal)) {
                leftVal = [leftVal];
            }
            if (!Array.isArray(rightVal)) {
                rightVal = [rightVal];
            }
        }

        if (
            typeof leftVal === "number" &&
            typeof rightVal === "number" &&
            leftVal !== rightVal
        ) {
            return leftVal < rightVal;
        } else if (Array.isArray(leftVal) && Array.isArray(rightVal)) {
            let result = compareList(leftVal, rightVal);
            if (result !== null) {
                return result;
            }
        }
    }

    return null;
}

console.log(
    "part 1:",
    pairs
        .map((pair, i) => {
            let [leftList, rightList] = pair.split("\n").map((x) => eval(x));
            return compareList(leftList, rightList) ? i + 1 : 0;
        })
        .reduce((a, b) => a + b, 0)
);

const part2Source = pairs.map((x) => x.split("\n").map((x) => eval(x))).flat();
const sorted = [...part2Source, [[2]], [[6]]].sort((a, b) =>
    compareList(a, b) ? -1 : 1
);

stringified = sorted.map((x) => JSON.stringify(x));
console.log(
    "part 2:",
    (stringified.indexOf("[[2]]") + 1) * (stringified.indexOf("[[6]]") + 1)
);
