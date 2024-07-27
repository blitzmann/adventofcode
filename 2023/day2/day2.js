const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");

const thresholds = {
    red: 12,
    green: 13,
    blue: 14,
};

// determiens if the game is possible
function isPossible(gameInfo) {
    for (let set of gameInfo.split(";")) {
        let colorsSets = set.split(",").map((x) => x.trim());

        for (let color of colorsSets) {
            let [num, colorName] = color.split(" ");
            if (+num > thresholds[colorName.trim()]) {
                return false;
            }
        }
    }
    return true;
}

// returns the game numbner if game is posible, otherwise 0. Used for functional reduce
function returnGameNumIfPossible([game, data]) {
    game = Number(game.split(" ")[1]);
    let possible = isPossible(data);
    return possible ? game : 0;
}

console.log(
    lines
        .map((line) => line.split(":").map((x) => x.trim()))
        .map(returnGameNumIfPossible)
        .reduce((a, b) => a + b, 0)
);

// Determines game power
function gamePower(gameInfo) {
    let acc = {
        red: 0,
        green: 0,
        blue: 0,
    };
    for (let set of gameInfo.split(";")) {
        let colorsSets = set.split(",").map((x) => x.trim());

        for (let color of colorsSets) {
            let [num, colorName] = color.split(" ");
            acc[colorName] = Math.max(acc[colorName], +num);
        }
    }
    return Object.values(acc).reduce((a, b) => a * b, 1);
}

console.log(
    lines
        .map((line) => line.split(":").map((x) => x.trim())[1])
        .map(gamePower)
        .reduce((a, b) => a + b, 0)
);
