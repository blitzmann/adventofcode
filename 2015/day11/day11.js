const fs = require("fs");
const aCode = "a".charCodeAt(0);

// todo: convert all this to a class

function windowedSlice(arr, size) {
    let result = [];
    arr.some((el, i) => {
        if (i + size > arr.length) return true;
        result.push(arr.slice(i, i + size));
    });
    return result;
}
const isIncreasingSequence = (numbers) =>
    numbers.every((number, i) => i === 0 || numbers[i - 1] === number - 1);

function convertToNumbers(string) {
    return string.split("").map((x) => x.charCodeAt(0) - aCode);
}

function convertToAlpha(numArr) {
    return String.fromCharCode(...numArr.map((x) => x + aCode));
}

function increment(numArr) {
    // optimization... if any of the letters are disallowed, specifically increment that one
    for (let i = numArr.length - 1; i >= 0; i--) {
        numArr[i] = (numArr[i] + 1) % 26;
        if (numArr[i] !== 0) {
            break;
        }
        // otherwise it will continue to carry
        if (i === 0) {
            numArr.unshift(0);
        }
    }
}

function hasIncWindow(numArr) {
    return windowedSlice(numArr, 3).map(isIncreasingSequence).some(Boolean);
}

function hasDoubles(numArr) {
    return !!convertToAlpha(numArr).match(/([a-z])\1.*([a-z])\2/);
}

function hasValidCharacters(numArr) {
    let set = new Set(...[numArr]);
    return !(
        set.has("i".charCodeAt(0) - aCode) ||
        set.has("o".charCodeAt(0) - aCode) ||
        set.has("l".charCodeAt(0) - aCode)
    );
}

let input = "vzbxkghb";
numArr = convertToNumbers(input);

function meetsRequirements(numArr) {
    let tests = [hasIncWindow, hasValidCharacters, hasDoubles];
    return tests.map((x) => x(numArr)).every(Boolean);
}

do {
    increment(numArr);
} while (!meetsRequirements(numArr));

console.log("part 1:", convertToAlpha(numArr));

do {
    increment(numArr);
} while (!meetsRequirements(numArr));

console.log("part 2:", convertToAlpha(numArr));
