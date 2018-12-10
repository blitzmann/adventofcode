import re
with open("input.txt", "r") as ins:
    input = ins.read()

# convert all lines to (datetime, message) tuples

regex = r"position=<(.+),(.+)> velocity=<(.+),(.+)>"
matches = re.finditer(regex, input, re.MULTILINE)
points = []

class Point:
    def __init__(self, x, y, xvel, yvel):
        self.x = x
        self.y = y
        self.xvel = xvel
        self.yvel = yvel

    def step(self):
        self.x += self.xvel
        self.y += self.yvel

    def __eq__(self, key):
        return key == (self.x, self.y)

    def __repr__(self):
        return "Point<{}, {}>".format(self.x, self.y)

for match in matches:
    first = int(match.group(1))
    second = int(match.group(2))
    three = int(match.group(3))
    four = int(match.group(4))
    p = Point(
        int(match.group(1)),
        int(match.group(2)),
        int(match.group(3)),
        int(match.group(4))
    )
    points.append(p)

def print_points(points):
    # find the max points
    max_x = max(points, key=lambda x: x.x).x+3
    min_x = min(points, key=lambda x: x.x).x-3
    max_y = max(points, key=lambda x: x.y).y+3
    min_y = min(points, key=lambda x: x.y).y-3

    x_range = max_x - min_x
    y_range = max_y - min_y

    # 20 is a good y value restriction - we don't know how long the word is going be be,
    # but we roughly know via the example how large the typeset is
    if y_range <= 20:
        print(x_range, y_range)

        for y in range(y_range):
            print(''.join(['#' if (min_x+x, min_y+y) in points else '.' for x in range(x_range)]))
        return True

stop = None
i = 0
while not stop:
    i += 1
    for p in points:
        p.step()

    stop = print_points(points)
print(i)
