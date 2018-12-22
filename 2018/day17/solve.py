import re
import numpy
from enum import IntEnum, unique

@unique
class BlockType(IntEnum):
    SAND = 0,
    WATER = 1,
    STANDING_WATER = 2
    SOURCE = 3
    CLAY = 4,

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

def convert_index_to_point(index):
    """converts point to array index"""
    return (index[1]+min_x, index[1])

matrix = numpy.full((max_y+1, (max_x-min_x)+1), BlockType.SAND)

for clay in clay_positions:
    y, x = convert_point_to_index(clay)
    print(x, y)
    if x in (0,1,-1):
        print(clay)
        pass
    matrix[y, x] = BlockType.CLAY

# matrix[6, 9] = BlockType.CLAY
#
# # matrix[6, 2] = BlockType.CLAY
# matrix[7, 2] = BlockType.SAND
# matrix[7, 5] = BlockType.SAND
#
# matrix[9, 9] = BlockType.CLAY


# 1570,147
#
# 1648, 19 keeps going right
#
# 1628, 11 - start of issue?
#
#
# 1608, 25

def search_left(y, x):
    sub_left = matrix[y:y + 2, :x]

    offset = 0
    for slice in numpy.flip(matrix[y:y+ 2, :x].T, 0):
        offset += 1
        if slice[0] in (BlockType.CLAY, BlockType.STANDING_WATER):
            matrix[y, x-offset+1 : x] = BlockType.STANDING_WATER
            return matrix[y, x-offset]

        if slice[1] == BlockType.SAND:
            matrix[y, x-offset] = BlockType.SOURCE
            matrix[y, x - offset+1: x] = BlockType.WATER  # flowing water to the source
            # we have found an opening below us, start the source
            keep_going = source((y, x-offset))
            if not keep_going:
                return None
    else:
        # we've reached the left bounds without hitting a wall or being able to fall. Mark the blocks as traversed
        matrix[y, x - offset: x] = BlockType.WATER


def search_right(y, x):
    sub_right = matrix[y:y + 2, x+1:]
    if y == 1570:
        print (y, x)

    offset = 0
    for slice in sub_right.T:
        offset += 1
        if slice[0] in (BlockType.CLAY, BlockType.STANDING_WATER):
            matrix[y, x:x + offset] = BlockType.STANDING_WATER
            return matrix[y, x+offset]

        if slice[1] == BlockType.SAND:
            matrix[y, x+offset] = BlockType.SOURCE
            matrix[y, x:x + offset] = BlockType.WATER  # flowing water to the source
            # we have found an opening below us, start the source
            keep_going = source((y, x+offset))
            if not keep_going:
                return None
    else:
        matrix[y, x:x + offset+1] = BlockType.WATER


def source(point):
    thing  = matrix
    """the start of calculations. A source of water is defines at a point in which water starts to flow downwards"""
    y, x = point
    matrix[y, x] = BlockType.SOURCE  # set this point as a source block
    if point == (1608, 25):
        print(point)
    # find next clay block
    offset = 1
    while True:
        if y + offset > max_y:
             return
        cell = matrix[y + offset, x]
        if cell in (BlockType.CLAY, BlockType.STANDING_WATER):
            break

        matrix[y + offset, x] = BlockType.WATER
        offset += 1

    # we have found the bottom of the flow
    for going_up in reversed(range(y, y+offset)):
        if going_up == y:
            return True
        # now we traverse up the flow, finding the left and right bounds
        right_result = search_right(going_up, x)
        left_result = search_left(going_up, x)
        if left_result is None or right_result is None:
            break
        pass
        # todo: fill in the water if we need to (either with )
        # todo: once we reach anoth source of water, stop the propogation upwards (unless the source is within a basin?)

    #
    # matrix[y+1:y+offset, x] = BlockType.WATER  # set this point as a source block
    #
    #
    # column_slice = matrix[y+1:, x]
    #
    # for slice in numpy.nditer(column_slice):
    #     print(slice)
    #     print(matrix[slice])
    #
    # blocking_index = numpy.argmax(column_slice > BlockType.SAND)
    #
    # # set all blocks traversed to water
    # matrix[y+1:blocking_index+1, x] = BlockType.WATER # set this point as a source block
    #
    # # track water left and right
    #
    # pass
    #
    # # return source(point)

source(convert_point_to_index((499, 0)))

#source((1628,11))

# print(matrix)
print (len(matrix[numpy.where(matrix==BlockType.WATER)])+len(matrix[numpy.where(matrix==BlockType.SOURCE)])+len(matrix[numpy.where(matrix==BlockType.STANDING_WATER)])-min_y)
pass
#
# def print_slice():
#
#
#     def char(pos):
#         if pos == (500, 0):
#             return '+'
#         if pos in clay_positions:
#             return '#'len(matrix[numpy.where(matrix =)])
#         return '.'
#
#     for y in range(0, max_y+1):
#         print(''.join([char((x, y)) for x in range(min_x-1, max_x+2)]))
#
#
#
# print_slice()
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
