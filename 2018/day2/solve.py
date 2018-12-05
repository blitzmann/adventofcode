from collections import Counter
import itertools

with open("input.txt", "r") as ins:
    lines = [x.strip() for x in ins]

# Part 1
num_two = 0
num_three = 0

for line in lines:
    counts = Counter(line)  # Counter({'l': 2, 'H': 1, 'e': 1, 'o': 1})
    count_set = set(counts.values())
    if 2 in count_set:
        num_two += 1
    if 3 in count_set:
        num_three += 1

print (num_two * num_three)

# Part 2
# Since we need to compare each ID with each other ID, create a combination iterator
combos = itertools.combinations(lines, 2)

for combo in combos:
    # zip object will represent the two character from each ID at each position, eg zip(12345,abcde) => [(1,a), (2,b), ...]
    z = zip(combo[0], combo[1])
    n = 0
    s = ""
    for left, right in z:
        if left != right:
            n += 1  # count the number of differences for each combo
        else:
            s += left  # if there's no difference, start creating the new result string

    # if, at the end, we only have 1 difference, then this is the ID combo that we need.
    if n == 1:
        # print out the new string, and break
        print(s)
        break
