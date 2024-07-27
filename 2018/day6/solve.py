import pprint
import string

bounding_box = 100  # additional padding to determine
from collections import deque
coords = []
with open("input.txt", "r") as ins:
    for x in ins:
        c = int(x.split(',')[0]), int(x.split(',')[1])
        coords.append(c)
import random
def colors(n):
  ret = []
  r = int(random.random() * 256)
  g = int(random.random() * 256)
  b = int(random.random() * 256)
  step = 256 / n
  for i in range(n):
    r += step
    g += step
    b += step
    r = int(r) % 256
    g = int(g) % 256
    b = int(b) % 256
    ret.append((r,g,b))
  return ret

coords_mapping = {x[0]: x[1] for x in zip(coords, colors(len(coords)))}

max_x = max(coords, key=lambda x: x[0])[0]
min_x = min(coords, key=lambda x: x[0])[0]

max_y = max(coords, key=lambda x: x[1])[1]
min_y = min(coords, key=lambda x: x[1])[1]

pprint.pprint(coords_mapping)

def determine_closest_coord(x, y):
    min = 1e9, (0,0)
    min_count = 1
    for coord in coords:
        distance = abs(x - coord[0]) + abs(y - coord[1])
        if distance < min[0]:
            min = distance, coord
            min_count = 1
        elif distance == min[0]:
            min_count += 1

    if min_count > 1:
        return (min[0], None), (255,255,255)
    return min, coords_mapping[min[1]]

def find_binding_box():
    # start with the min/max of current box, and start increasing by one until we get one that only has four letters
    found = False
    i = 0
    while not found:
        check = set()
        for x in range(min_x-i, max_x+i):
            # checks left and right bounding box
            check.add(determine_closest_coord(x, min_y-i)[1])
            check.add(determine_closest_coord(x, max_y+i)[1])
        for y in range(min_y-i, max_y+i):
            # checks top and bottom bounding box
            check.add(determine_closest_coord(min_x-i, y)[1])
            check.add(determine_closest_coord(max_x+i, y)[1])
        check.remove('.')
        #print(i, len(check), check)
        if len(check) == 4:

            break
        i += 1
    return i

matrix = deque([])
for y in range(min_y - bounding_box, max_y+ bounding_box):
    matrix.append(deque([coords_mapping[(x,y)] if (x, y) in coords else determine_closest_coord(x, y)[1] for x in range(min_x - bounding_box, max_x + bounding_box)]))
pass

import numpy

data = numpy.array(matrix)

from PIL import Image
w, h = 512, 512
img = Image.fromarray(data, 'RGB')
img.save('my.png')
img.show()
#
# im = Image.fromarray(numpy.uint8(cm.gist_earth(matrix)*255))
