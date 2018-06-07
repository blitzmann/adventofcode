lines = []

with open("input.txt", "r") as ins:
    for line in ins:
        lines.append([int(x) for x in line.strip().split("\t")])

print(sum([max(x) - min(x) for x in lines]))

# Part 2

def find_evenly_divisible(l):
    for i, x in enumerate(l):
        for i2, x2 in enumerate(l):
            if i == i2:
                continue

            if x % x2 == 0:
                return int(x/x2)

print(sum([find_evenly_divisible(x) for x in lines]))