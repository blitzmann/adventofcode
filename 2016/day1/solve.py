# Part 1

input = """
R3, L5, R2, L2, R1, L3, R1, R3, L4, R3, L1, L1, R1, L3, R2, L3, L2, R1, R1, L1, R4, L1, L4, R3, L2, L2, R1, L1, R5, R4, 
R2, L5, L2, R5, R5, L2, R3, R1, R1, L3, R1, L4, L4, L190, L5, L2, R4, L5, R4, R5, L4, R1, R2, L5, R50, L2, R1, R73, R1, 
L2, R191, R2, L4, R1, L5, L5, R5, L3, L5, L4, R4, R5, L4, R4, R4, R5, L2, L5, R3, L4, L4, L5, R2, R2, R2, R4, L3, R4, 
R5, L3, R5, L2, R3, L1, R2, R2, L3, L1, R5, L3, L5, R2, R4, R1, L1, L5, R3, R2, L3, L4, L5, L1, R3, L5, L2, R2, L3, L4, 
L1, R1, R4, R2, R2, R4, R2, R2, L3, L3, L4, R4, L4, L4, R1, L4, L4, R1, L2, R5, R2, R3, R3, L2, L5, R3, L3, R5, L2, R3, 
R2, L4, L3, L1, R2, L2, L3, L5, R3, L1, L3, L4, L3
"""

input = [x.strip() for x in input.split(',')]

point = [0, 0]
direction = 0  # determines which direction we are heading, based on %4

for x in input:
    direction += 1 if x[0] == 'R' else -1

    if direction % 4 == 1:  # x axis is being increased
        point[0] += int(x[1:])
    elif direction % 4 == 3: # x axis decreasing
        point[0] -= int(x[1:])
    elif direction % 4 == 0: # y axis increasing
        point[1] += int(x[1:])
    elif direction % 4 == 2: # y axis decreasing
        point[1] -= int(x[1:])

print(abs(point[0]) + abs(point[1]))

print("=" * 20)

# Part 2

def findPoints(input):
    points = [(0, 0)]  # collection of points visited
    direction = 0  # determines which direction we are heading, based on %4

    for x in input:
        direction += 1 if x[0] == 'R' else -1

        for y in range(int(x[1:])):
            point = list(points[-1])

            if direction % 4 == 1:  # x axis is being increased
                point[0] += 1
            elif direction % 4 == 3: # x axis decreasing
                point[0] -= 1
            elif direction % 4 == 0: # y axis increasing
                point[1] += 1
            elif direction % 4 == 2: # y axis decreasing
                point[1] -= 1

            point = tuple(point)

            if point in points:
                return point

            points.append(point)

point = findPoints(input)
print(abs(point[0]) + abs(point[1]))
