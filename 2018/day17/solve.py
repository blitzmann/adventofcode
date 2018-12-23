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
    return point[1], point[0] - min_x+1

def convert_index_to_point(index):
    """converts point to array index"""
    return index[1] + min_x, index[1]

# give x a buffer of 1 on either side to allow water running along clay and hitting the edge to fall
matrix = numpy.full((max_y+1, (max_x-min_x)+1+2), BlockType.SAND)

for clay in clay_positions:
    y, x = convert_point_to_index(clay)
    if x in (0,1,-1):
        pass
    matrix[y, x] = BlockType.CLAY

# manually tweak map to test various situations

# matrix[6, 9] = BlockType.CLAY
# matrix[6, 2] = BlockType.CLAY
# matrix[7, 2] = BlockType.SAND
# matrix[7, 5] = BlockType.SAND
# matrix[9, 9] = BlockType.CLAY


def search_left(y, x):
    sub_left = matrix[y:y + 2, :x]

    offset = 0
    for slice in numpy.flip(sub_left.T, 0):
        offset += 1
        if slice[0] in (BlockType.CLAY, BlockType.STANDING_WATER):
            return BlockType.CLAY, x-offset+1

        if slice[1] == BlockType.SAND:
            matrix[y, x-offset] = BlockType.SOURCE
            # we have found an opening below us, start the source
            keep_going = source((y, x-offset))
            if not keep_going:
                return BlockType.SOURCE, x - offset+1
    else:
        return None, x - offset
        # we've reached the left bounds without hitting a wall or being able to fall. Mark the blocks as traversed


def search_right(y, x):
    # get slice from where we are, all the way to the end
    sub_right = matrix[y:y + 2, x+1:]

    offset = 0
    for slice in sub_right.T:
        offset += 1
        if slice[0] in (BlockType.CLAY, BlockType.STANDING_WATER):
            return BlockType.CLAY, x+offset

        if slice[1] == BlockType.SAND:
            # we have found an opening below us, start the source
            keep_going = source((y, x+offset))
            if not keep_going:
                return BlockType.SOURCE, x+offset
    else:
        return None, x+offset+1


def source(point):
    thing  = matrix
    """the start of calculations. A source of water is defines at a point in which water starts to flow downwards"""
    y, x = point
    matrix[y, x] = BlockType.SOURCE  # set this point as a source block

    # for debugging a source block
    # if point == (1608, 25):
    #     print(point)

    # find next clay block
    offset = 1
    while True:
        if y + offset > max_y:
             return
        cell = matrix[y + offset, x]
        if cell in (BlockType.CLAY, BlockType.STANDING_WATER):
            break

        if cell == BlockType.WATER:
            return
        matrix[y + offset, x] = BlockType.WATER
        offset += 1

    # we have found the bottom of the flow
    for going_up in reversed(range(y, y+offset)):
        if going_up == y:
            return True

        # now we traverse up the flow, finding the left and right bounds
        right_result, right_bound = search_right(going_up, x)
        left_result, left_bound = search_left(going_up, x)

        if right_result == BlockType.CLAY and left_result == BlockType.CLAY:
            matrix[going_up, left_bound:right_bound] = BlockType.STANDING_WATER
        else:
            matrix[going_up, left_bound:right_bound] = BlockType.WATER

        if left_result == BlockType.SOURCE or right_result == BlockType.SOURCE:
            break

source(convert_point_to_index((499, 0)))

sub_matrix = matrix[min_y : , :]

print(len(sub_matrix[numpy.where(sub_matrix==BlockType.WATER)])+len(sub_matrix[numpy.where(sub_matrix==BlockType.SOURCE)])+len(sub_matrix[numpy.where(sub_matrix==BlockType.STANDING_WATER)]))

def char(x):
        if x == BlockType.SAND:
            return '.'
        if x == BlockType.WATER:
            return '|'
        if x == BlockType.STANDING_WATER:
            return '~'
        if x == BlockType.CLAY:
            return '#'
        if x == BlockType.SOURCE:
            return '+'

for row in sub_matrix:
    print(''.join([char(x) for x in row]))

