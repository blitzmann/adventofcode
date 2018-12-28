import re
from enum import IntEnum
import networkx


class Type(IntEnum):
    ROCKY = 0
    WET = 1
    NARROW = 2


class Tool(IntEnum):
    NOTHING = 0
    CLIMBING = 1
    TORCH = 2


buffer = 50  # additional calculated col/rows for the matrix, used because part two isn't restricted to bounds of part 1

with open("input.txt", "r") as ins:
    input = ins.read()
    regex = r"depth: (\d+)\ntarget: (\d+),(\d+)"
    matches = re.findall(regex, input, re.MULTILINE)
    depth = int(matches[0][0])
    target = (int(matches[0][1]), int(matches[0][2]))

matrix = [[None for j in range(target[0]+buffer)] for i in range(target[1]+buffer)]

for y, dy in enumerate(matrix):
    for x, dx in enumerate(dy):
        if (x, y)in ((0, 0), target):
            erosion = (0 + depth) % 20183
        elif y == 0:
            erosion = ((x * 16807) + depth) % 20183
        elif x == 0:
            erosion = ((y * 48271) + depth) % 20183
        else:
            erosion = ((matrix[y][x-1][0] * matrix[y-1][x][0]) + depth) % 20183
        type = erosion % 3

        matrix[y][x] = (erosion, type)

risk = sum([matrix[y][x][1] for x in range(target[0]+1) for y in range(target[1]+1)])
print(risk)

# part 2 - I had a vauge idea that this would involve pathfinding with 3 dimensions (x, y, and tool). I had no idea how to start implementing this though. As such,
# I looked it up. I liked this solution: https://www.reddit.com/r/adventofcode/comments/a8i1cy/2018_day_22_solutions/ecax7lr/

# get a set of allowed tools for a given erosion level
def allowed_tools(type):
    if type == Type.ROCKY:
        return {Tool.CLIMBING, Tool.TORCH}
    if type == Type.WET:
        return {Tool.NOTHING, Tool.CLIMBING}
    if type == Type.NARROW:
        return {Tool.NOTHING, Tool.TORCH}

neighbours = lambda x, y: [(x-1, y),(x+1, y),(x, y-1),(x, y+1)]

G = networkx.DiGraph()
for y in range(len(matrix)):
    for x in range(len(matrix[0])):
        # loop to determine weight for switching to another tool on the current coord (2 edges added)
        allowed = allowed_tools(matrix[y][x][1])
        for t1 in allowed:
            for t2 in allowed:
                if t1 == t2:
                    continue
                G.add_edge((x, y, t1), (x, y, t2), weight=7)

        # create edges with a weight of 1 between to neighbors with with proper tool support
        for nx, ny in neighbours(x, y):
            if nx < 0 or nx >= len(matrix[0]):
                continue
            if ny < 0 or ny >= len(matrix):
                continue
            from_erosion = matrix[y][x][1]
            to_erosion = matrix[ny][nx][1]

            # get tools that can be used when travelling between these cells
            tools = allowed_tools(from_erosion).intersection(allowed_tools(to_erosion))

            for tool in tools:
                G.add_edge((x, y, tool), (nx, ny, tool), weight=1)


shortest_path_length = networkx.dijkstra_path_length(G, (0, 0, Tool.TORCH), (target[0], target[1], Tool.TORCH))
print(shortest_path_length)

def print_map():
    def char(type):
        if type == Type.ROCKY: return '.'
        if type == Type.NARROW: return '.'
        if type == Type.WET: return '#'

    for y, dy in enumerate(matrix):
        print(''.join(char(matrix[y][x][1]) for x, dx in enumerate(dy)))

print_map()
