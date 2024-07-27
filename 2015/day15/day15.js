const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

var ingredients = {};

text.split("\n").forEach(function (ingredient) {
    var match =
        /(\w+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)/.exec(
            ingredient
        );
    ingredients[match[1]] = {
        name: match[1],
        capacity: parseInt(match[2]),
        durability: parseInt(match[3]),
        flavor: parseInt(match[4]),
        texture: parseInt(match[5]),
        calories: parseInt(match[6]),
    };
});

var ingredientNames = Object.keys(ingredients);

// Found on reddit
function getRemainderPossibilities(total, n) {
    n = n || 0;
    var spaces = new Array(n * 4 + 1).join(" ");

    var possibilities = [];

    if (n === ingredientNames.length - 1) {
        return [
            [
                {
                    name: ingredientNames[n],
                    amount: total,
                },
            ],
        ];
    } else {
        for (var i = total; i >= 0; i--) {
            var item = {
                name: ingredientNames[n],
                amount: i,
            };

            if (i !== total) {
                var remainder = getRemainderPossibilities(total - i, n + 1);
                if (!remainder.length) {
                    console.log(spaces, "debg:", total - i, n + 1);
                }
                remainder.forEach(function (list) {
                    if (i !== 0) {
                        list.unshift(item);
                    }
                    possibilities.push(list);
                });
            } else {
                possibilities.push([item]);
            }
        }
    }

    return possibilities;
}

function score(list, requiredCalories) {
    var capacity = (durability = flavor = texture = calories = 0);

    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        capacity += ingredients[item.name].capacity * item.amount;
        durability += ingredients[item.name].durability * item.amount;
        flavor += ingredients[item.name].flavor * item.amount;
        texture += ingredients[item.name].texture * item.amount;
        calories += ingredients[item.name].calories * item.amount;
    }

    if (capacity <= 0 || durability <= 0 || flavor <= 0 || texture <= 0)
        return 0;

    if (requiredCalories && calories !== requiredCalories) return 0;

    return capacity * durability * flavor * texture;
}

var possibilities = getRemainderPossibilities(100);
var partOne = (partTwo = 0);
possibilities.forEach(function (list, i) {
    partOne = Math.max(partOne, score(list));
    partTwo = Math.max(partTwo, score(list, 500));
});

console.log("Part One:", partOne);
console.log("Part Two:", partTwo);
