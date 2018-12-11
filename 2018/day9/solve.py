import re
import operator
import itertools
import pprint

class CircularList(list):
    def __getitem__(self, x):
        if isinstance(x, slice):
            return [self[x] for x in self._rangeify(x)]

        index = operator.index(x)
        try:
            return super().__getitem__(index % len(self))
        except ZeroDivisionError:
            raise IndexError('list index out of range')

    def _rangeify(self, slice):
        start, stop, step = slice.start, slice.stop, slice.step
        if start is None:
            start = 0
        if stop is None:
            stop = len(self)
        if step is None:
            step = 1
        return range(start, stop, step)

with open("input.txt", "r") as ins:
    input = ins.read()

# convert all lines to (datetime, message) tuples

regex = r"(\d+) players; last marble is worth (\d+) points"
matches = re.findall(regex, input)
num_players, last_marble = matches[0]
last_marble = int(last_marble)* 100
lol = []
lol.append(0)

marbles = CircularList([])
gen = itertools.count(0,1)
current_marble = next(gen)
marbles.append(current_marble)

player_scores = {x+1: 0 for x in range(int(num_players))}
keep_going = True

while keep_going:
    for x in range(int(num_players)):
        next_marble = next(gen)

        if next_marble % 23 == 0:
            deletion_index = marbles.index(current_marble) - 7
            delete_value = marbles[deletion_index]
            player_scores[x+1] += next_marble + delete_value

            # set the marble to the one immidiate tot he right of the deleted one
            current_marble = marbles[marbles.index(current_marble) - 6]

            marbles.remove(delete_value)
            continue

        if len(marbles) == 1:
            new_idx = 1
        else:
            new_idx = ((marbles.index(current_marble)+2) % len(marbles))

        marbles.insert(new_idx, next_marble)
        current_marble = next_marble

        if next_marble == int(last_marble):
            keep_going = False
            break

print(max(player_scores.values()))