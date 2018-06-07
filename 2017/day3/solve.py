import math
lines = []

target = 347991

# Get a simple spiral going. Honestly, we don't need to append to this - we simply need to keep track of last value in
# layer, and current radius. Could re-write this to make it more efficient
spiral = [
    [1],
    [2, 3, 4, 5, 6, 7, 8, 9]
]

while True:
    # get last number in layer
    n = max(spiral[-1])
    # get length of last layer
    t = len(spiral[-1])
    # get new length based off old wrap and 4 corners
    x = int((((t / 4) + 1) * 4) + 4)
    spiral.append([i for i in range(n+1, n+x+1)])

    if target in spiral[-1]:
        break

# general info: we can expect the last value of the layer to represent the bottom-right corner
chunk_func = lambda ulist, step:  map(lambda i: ulist[i:i+step],  range(0, len(ulist), step))

# split the layer into 4 chunks (one for each side)
chunks = list(chunk_func(spiral[-1], int(len(spiral[-1]) / 4)))

# get the chunk that the number resides in
chunk_num = math.ceil((spiral[-1].index(target)+1)/(len(spiral[-1])/4))
chunk = chunks[chunk_num-1]

# Get the half-way point of the chunk (floored due to skew). This should get us in line with the center of the spiral
center = math.floor(len(chunk)/2)

# next get index of target within chunk
target_chunk_index = chunk.index(target)

# Finally, get radius of spiral and add these two together
radius = len(spiral)

print("Distance: {}".format(radius + abs(target_chunk_index - center)))
