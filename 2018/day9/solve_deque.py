import re
import itertools
from collections import deque
import pprint

# same concept as the other solve file, however this uses deque instead of a Circular List thing
# deques are apparently much more performant than lists when dealing with arbitrary appending and removing of elements

with open("input.txt", "r") as ins:
    input = ins.read()

regex = r"(\d+) players; last marble is worth (\d+) points"
matches = re.findall(regex, input)
num_players, last_marble = matches[0]
last_marble = int(last_marble) # add this for part 2: * 100

gen = itertools.count(0, 1)
marbles = deque([next(gen)])

player_scores = {x+1: 0 for x in range(int(num_players))}
keep_going = True

while keep_going:
    for x in range(int(num_players)):
        next_marble = next(gen)

        if next_marble % 23 == 0:
            marbles.rotate(7)
            delete_value = marbles.pop()
            player_scores[x+1] += next_marble + delete_value
            marbles.rotate(-1)
            continue

        marbles.rotate(-1)
        marbles.append(next_marble)

        if next_marble == int(last_marble):
            keep_going = False
            break

print(max(player_scores.values()))