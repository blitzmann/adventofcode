const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

roll = 0;

players = [
    { position: 7, score: 0 },
    { position: 4, score: 0 },
];

player = 0;
let t = 0;
while (true) {
    let rolls = Array.from({ length: 3 }).map((x) => {
        roll++;
        if (roll > 100) {
            roll = 1;
        }
        return roll;
    });
    let moves = rolls.reduce((a, b) => a + b, 0);
    t += 3;
    players[player].position = (players[player].position + moves) % 10;
    players[player].score += players[player].position + 1;
    if (players[player].score >= 1000) {
        break;
    }
    player ^= 1; // toggle next player
}

let loser = players.sort((a, b) => a.score - b.score)[0];
console.log(t * loser.score);
