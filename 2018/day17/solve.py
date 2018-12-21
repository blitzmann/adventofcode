import re
import numpy
from enum import IntEnum, unique

@unique
class BlockType(IntEnum):
    SAND = 0,
    WATER = 1,
    SOURCE = 2
    CLAY = 3,

clay_positions = set()

with open("input.txt", "r") as ins:
    input = ins.read()

    regex = r"(x|y)=(\d+), (x|y)=(\d+)..(\d+)"
    matches = re.finditer(regex, input, re.MULTILINE)

    for match in matches:
        for i in range(int(match.group(4)), int(match.group(5))+1):
            # determine which side the range is on
            if match.group(1) == 'x':
                clay_positions.add((int(match.group(2)), i))
            else:
                clay_positions.add((i, int(match.group(2))))

max_x = max(clay_positions, key=lambda c: c[0])[0]
min_x = min(clay_positions, key=lambda c: c[0])[0]
max_y = max(clay_positions, key=lambda c: c[1])[1]
min_y = min(clay_positions, key=lambda c: c[1])[1]

def convert_point_to_index(point):
    """converts point to array index"""
    if point[0] == min_x:
        pass
    return (point[1], point[0]-min_x)

matrix = numpy.full((max_y+1, (max_x-min_x)+1), BlockType.SAND)

for clay in clay_positions:
    y, x = convert_point_to_index(clay)
    print(x, y)
    if x in (0,1,-1):
        print(clay)
        pass
    matrix[y, x] = BlockType.CLAY
def source(point):
    """the start of calculations. A source of water is defines at a point in which water starts to flow downwards"""
    # set this block as the source
    # find the first block directly under the source
    matrix[convert_point_to_index(point)] = BlockType.SOURCE
    # return source(point)

source((500, 0))
print(matrix)



def print_slice():


    def char(pos):
        if pos == (500, 0):
            return '+'
        if pos in clay_positions:
            return '#'
        return '.'

    for y in range(0, max_y+1):
        print(''.join([char((x, y)) for x in range(min_x-1, max_x+2)]))



print_slice()
#
# def calc_new_direction(cart):
#     cart.position = tuple(sum(x) for x in zip(cart.position, new_direction_mapping[cart.direction]))
#     new_point = matrix[cart.y][cart.x]
#
#     # determine if the cart has changed direction
#     if new_point in (Map.CORNER_FORWARD, Map.CORNER_BACK):
#         cart.direction = turn_corner[cart.direction, new_point]
#     if new_point == Map.INTERSECTION:
#         cart.direction = cart.intersection_decision()
#
#
# def print_map():
#     cart_positions = {x.position: x for x in carts}
#     for y, y_data in enumerate(matrix):
#         s = ''
#         for x, x_data in enumerate(y_data):
#             cart = cart_positions.get((x, y), None)
#             if cart:
#                 s += direction_mapping_inverse[cart.direction]
#             else:
#              s += map_mapping_inverse[x_data]
#         print(s)
#     pass
#
#
# keep_going = True
# while keep_going:
#     for cart in sorted(carts, key=lambda c: (c.position[1], c.position[0])):
#         calc_new_direction(cart)
#         # check if cart's position is same as any other carts position
#         if cart.position in [c.position for c in carts if cart != c]:
#
#             print("Crash! {}".format(cart.position))
#             carts = list(filter(lambda c: c.position != cart.position, carts))
#
#     if len(carts) == 1:
#         print("Last cart! {}".format(carts[0].position))
#         keep_going = False
#
#     # print_map()
