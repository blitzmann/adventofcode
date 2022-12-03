const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const rounds = text.split("\r\n");

// We can convert these using character codes to normalize
// This allows us to avoid a mapping
function translateThem(char) {
    return char.charCodeAt(0) - "A".charCodeAt(0);
}

function translateMe(char) {
    return char.charCodeAt(0) - "X".charCodeAt(0);
}

function normalize(round) {
    const data = round.trim().split(" ");
    return [translateThem(data[0]), translateMe(data[1])];
}

// Now that RPS is now normalized, we can now we use the fact that 1 < 2 < 3 to determine who wins, and use modulo arithmetic to determine the score
function calcScore(them, me) {
    //                             +----------- Determines our bonus based on the outcome (since it's a multiple of 3)
    //                             |   +------- We always add our own play to the score
    //                             |   |    +-- Because it was always off by one ¯\_(ツ)_/¯
    //                             v   v    v
    return ((me + 4 - them) % 3) * 3 + me + 1;
    //       ^----------------^---------------- Determines the outcome (0 lose, 1 draw, 2 win).
}

// For this one, we take the same formula and switch out what the "unknown" is that we need to solve for. In this case, we know the outcome and so can plug that in
// but now we don't know the "me" value and need to solve for that
function calcScore2(them, outcome) {
    //                    v----------------------v------ Determines what our play should be
    return outcome * 3 + ((them + outcome + 2) % 3) + 1;
    //     ^---------^ --------------------------------- Same as part 1, except this time outcome is already given to us
}

console.log(
    rounds
        .map(normalize)
        .map((x) => calcScore(...x))
        .reduce((a, b) => a + b, 0)
);

console.log(
    rounds
        .map(normalize)
        .map((x) => calcScore2(...x))
        .reduce((a, b) => a + b, 0)
);
