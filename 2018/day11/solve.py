import pprint
import numpy
input = 8199

x_max = 300
y_max = 300

matrix = []

def calc_power_level(x, y):
    rack_id = x + 10  # Find the fuel cell's rack ID, which is its X coordinate plus 10.
    power_level = rack_id * y  # Begin with a power level of the rack ID times the Y coordinate.
    power_level += input  # Increase the power level by the value of the grid serial number
    power_level *= rack_id  # Set the power level to itself multiplied by the rack ID
    power_level = int(str(power_level)[::-1][2])  # Keep only the hundreds digit of the power level
    power_level -= 5  # Subtract 5 from the power level.
    return power_level


# initialize matrix
for y in range(y_max):
    arr = []
    for x in range(x_max):
        arr.append(calc_power_level(x+1, y+1))  # zero-indexed, so add 1
    matrix.append(arr)

# probably could have initialized the numpy array using a function for each coordinate, but meh
matrix = numpy.array(matrix)
three_by_three_calcs = {}
# loop through and find highest value
for y in range(y_max-3):
    for x in range(x_max-3):
        # get next three to the right, and next three down
        sub = matrix[y:y+3, x:x+3]
        three_by_three_calcs[(x+1,y+1)] = numpy.sum(sub)  # sum the sub

print(max(three_by_three_calcs, key=lambda x: three_by_three_calcs[x]))

all_calcs = {}
# there's gotta be a more efficient way other than doing 300x300x300 iterations (27 mil!)
for size in range(1, 301):
    for y in range(y_max-size):
        for x in range(x_max-size):
            # get next three to the right, and next three down
            sub = matrix[y:y+size, x:x+size]
            all_calcs[(x+1,y+1,size)] = numpy.sum(sub)  # sum the sub

print(max(all_calcs, key=lambda x: all_calcs[x]))