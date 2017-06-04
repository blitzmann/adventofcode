triangles = []

with open("input.txt", "r") as ins:
    for line in ins:
        triangles.append([int(x) for x in ' '.join(line.strip().split()).split()])

# Part 1
i = 0
for x in triangles:
    maxVal = x.pop(x.index(max(x)))
    i += 1 if maxVal < sum(x) else 0

print i

# Part 2
triangles_tmp = []

with open("input.txt", "r") as ins:
    for line in ins:
        triangles_tmp.append([int(x) for x in ' '.join(line.strip().split()).split()])

numbers = []
for x, _ in enumerate(triangles_tmp[0]):
    numbers.extend([row[x] for row in triangles_tmp])

# https://stackoverflow.com/a/312464/788054
triangles = [numbers[i:i + 3] for i in xrange(0, len(numbers), 3)]

i = 0
for x in triangles:
    maxVal = x.pop(x.index(max(x)))
    i += 1 if maxVal < sum(x) else 0

print i