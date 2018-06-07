import collections
import itertools

lines = []
count = 0

with open("input.txt", "r") as ins:
    for line in ins:
        lines.append(line.strip().split(" "))

count= 0
for l in lines:  # for each link
    count += 1 if len(l) == len(set(l)) else 0

print(count)

# Part 2

count = 0

for l in lines:  # for each link
    # get a list of Counters for each element, which will give a <letter>:<count>
    counters = [collections.Counter(x) for x in l]

    # You can use Counter with an equality operator to determine if two elements have the same frequency of letters
    # Also using itertools.combinations to generate the combination of checks needed
    if not any([a == b for a, b in itertools.combinations(counters, 2)]):
        count += 1

print(count)

