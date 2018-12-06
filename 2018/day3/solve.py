import re
import numpy

with open("input.txt", "r") as ins:
    input = ins.read()

x = 1000
y = 1000

# create a matrix with numpy (can also do a simple 2d array, but numpy makes this a bit quicker)
matrix = numpy.full((x, y), 0, int)

regex = r"#(\d+) @ (\d+),(\d+): (\d+)x(\d+)"

matches = re.finditer(regex, input , re.MULTILINE)
cached_claims = {}

claims_other_cache = {}

for match in matches:
    claim = match.group(1)
    left_offset = int(match.group(2))
    top_offset = int(match.group(3))
    x = int(match.group(4))
    y = int(match.group(5))

    #always assume it's exclusive.
    claims_other_cache[claim] = True

    for x_pos in range(x):
        for y_pos in range(y):
            key = (left_offset + x_pos, top_offset + y_pos)
            sqin_claims = cached_claims.get(key, None)
            if sqin_claims is None:
                sqin_claims = cached_claims[key] = set()

            sqin_claims.add(claim)
            matrix[top_offset+y_pos][left_offset+x_pos] += 1

# where values is > 1 (being claimed by more than 1 claim)
print(len(matrix[numpy.where(matrix > 1)]))

# part 2:
# Keep track of claims per square inch
# As we process, check that areas to see if any other claim has been noted. If it has, lookup all the claims for the




