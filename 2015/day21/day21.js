const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

let presentTarget = parseInt(text);
function fight(player, boss) {
    let pTurn = true; // player always goes first
    while (true) {
        let attacker = pTurn ? player : boss;
        let defender = pTurn ? boss : player;
        let dmgDealt = Math.max(attacker.dmg - defender.armor, 1); // 1 damage always happens
        defender.hp -= dmgDealt;
        if (defender.hp < 1) {
            return pTurn; // true if player wins
        }
        pTurn = !pTurn;
    }
}

// this is to just verify numbers. I noticed that my dmg + armor had to be 10 or more to win the fight
// the problem was actually solved via pencil / paper, but I could revisit this and devis an algorithm
// that finds the most efficient combination knowing that dmg an+ armor needs to = 10
console.log(
    // 7 3
    fight({ hp: 100, dmg: 9, armor: 0 }, { hp: 100, dmg: 8, armor: 2 })
);
