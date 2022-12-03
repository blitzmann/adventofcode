const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const rounds = text.split("\r\n");

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;

const mapping = {
    A: ROCK,
    B: PAPER,
    C: SCISSORS,
    X: ROCK,
    Y: PAPER,
    Z: SCISSORS,
};

function calcScore(them, me) {
    let score = 0;
    score += me;
    if (me === them) {
        score += 3;
    } else if (me == ROCK && them == SCISSORS) {
        score += 6;
    } else if (me == PAPER && them == ROCK) {
        score += 6;
    } else if (me == SCISSORS && them == PAPER) {
        score += 6;
    }
    return score;
}

scores = rounds.map((x) =>
    calcScore(
        ...x
            .trim()
            .split(" ")
            .map((x) => mapping[x])
    )
);

console.log(scores.reduce((a, b) => a + b, 0));

function calcScore2(them, meOpCode) {
    me = null;
    if (meOpCode == PAPER) {
        // draw, use the same one
        me = them;
    }
    if (meOpCode == ROCK) {
        // I need to lose
        if (them == SCISSORS) {
            me = PAPER;
        }
        if (them == ROCK) {
            me = SCISSORS;
        }
        if (them == PAPER) {
            me = ROCK;
        }
    }
    if (meOpCode == SCISSORS) {
        // I need to win
        if (them == SCISSORS) {
            me = ROCK;
        }
        if (them == ROCK) {
            me = PAPER;
        }
        if (them == PAPER) {
            me = SCISSORS;
        }
    }

    return calcScore(them, me);
}

scores = rounds.map((x) =>
    calcScore2(
        ...x
            .trim()
            .split(" ")
            .map((x) => mapping[x])
    )
);

console.log(scores.reduce((a, b) => a + b, 0));
