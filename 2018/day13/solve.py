from enum import IntEnum

# Define directions
class Direction(IntEnum):
    NORTH = 1
    WEST = 2
    EAST = 3
    SOUTH = 4


# define various map elements
class Map(IntEnum):
    HORIZONTAL = 1
    VERTICAL = 2
    INTERSECTION = 3
    CORNER_BACK = 4
    CORNER_FORWARD = 5


# define some mappings
direction_mapping = {
    '>': Direction.EAST,
    '<': Direction.WEST,
    '^': Direction.NORTH,
    'v': Direction.SOUTH
}

direction_mapping_inverse = {v: k for k, v in direction_mapping.items()}

map_mapping = {
    '-': Map.HORIZONTAL,
    '|': Map.VERTICAL,
    '+': Map.INTERSECTION,
    '/': Map.CORNER_FORWARD,
    '\\': Map.CORNER_BACK,
    ' ': None
}

map_mapping_inverse = {v: k for k, v in map_mapping.items()}

new_direction_mapping = {  # maps x/y modification based on current direction
    Direction.EAST: (1, 0),
    Direction.WEST: (-1, 0),
    Direction.NORTH: (0, -1),
    Direction.SOUTH: (0, 1)
}

turn_corner = {
    (Direction.EAST, Map.CORNER_FORWARD): Direction.NORTH,
    (Direction.EAST, Map.CORNER_BACK): Direction.SOUTH,
    (Direction.WEST, Map.CORNER_FORWARD): Direction.SOUTH,
    (Direction.WEST, Map.CORNER_BACK): Direction.NORTH,
    (Direction.SOUTH, Map.CORNER_FORWARD): Direction.WEST,
    (Direction.SOUTH, Map.CORNER_BACK): Direction.EAST,
    (Direction.NORTH, Map.CORNER_FORWARD): Direction.EAST,
    (Direction.NORTH, Map.CORNER_BACK): Direction.WEST,
}

# this is an object that helps determine left/right turns for intersections
directions = [Direction.WEST, Direction.NORTH, Direction.EAST, Direction.SOUTH]


class Cart:
    def __init__(self, x, y, direction):
        self.x = x
        self.y = y
        self.direction = direction
        self.memory = 0

    @property
    def position(self):
        return self.x, self.y

    @position.setter
    def position(self, value):
        self.x, self.y = value

    def intersection_decision(self):
        self.memory += 1
        idx = directions.index(self.direction)  # get the index of our current direction
        if self.memory % 3 == 1:
            return directions[idx - 1]
        if self.memory % 3 == 2:
            return directions[idx]
        if self.memory % 3 == 0:
            return directions[(idx + 1) % len(directions)]

    def __repr__(self):
        return "Cart<x={}, y={}, direction={}>".format(self.x, self.y, self.direction)

matrix = []
carts = []

with open("input.txt", "r") as ins:
    for y, y_data in enumerate(ins):
        arr = []
        for x, x_data in enumerate(y_data):
            if map_mapping.get(x_data, None):
                arr.append(map_mapping.get(x_data))
            elif x_data in ('>', '<'):
                arr.append(Map.HORIZONTAL)
            elif x_data in ('v', '^'):
                arr.append(Map.VERTICAL)
            else:
                arr.append(None)

            # create a cart object
            if x_data in direction_mapping.keys():
                carts.append(Cart(x, y, direction_mapping[x_data]))
        matrix.append(arr)


def calc_new_direction(cart):
    cart.position = tuple(sum(x) for x in zip(cart.position, new_direction_mapping[cart.direction]))
    new_point = matrix[cart.y][cart.x]

    # determine if the cart has changed direction
    if new_point in (Map.CORNER_FORWARD, Map.CORNER_BACK):
        cart.direction = turn_corner[cart.direction, new_point]
    if new_point == Map.INTERSECTION:
        cart.direction = cart.intersection_decision()


def print_map():
    cart_positions = {x.position: x for x in carts}
    for y, y_data in enumerate(matrix):
        s = ''
        for x, x_data in enumerate(y_data):
            cart = cart_positions.get((x, y), None)
            if cart:
                s += direction_mapping_inverse[cart.direction]
            else:
             s += map_mapping_inverse[x_data]
        print(s)
    pass


keep_going = True
while keep_going:
    for cart in sorted(carts, key=lambda c: (c.position[1], c.position[0])):
        calc_new_direction(cart)
        # check if cart's position is same as any other carts position
        if cart.position in [c.position for c in carts if cart != c]:
            print(cart.position)
            keep_going = False
            break
    # print_map()
