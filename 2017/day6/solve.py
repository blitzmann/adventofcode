# A note on this one: instead of breaking the loop out twice, I simply incorporated part 2 into part 1's loop
# This thing should print out two number. For part one, the first number is the answer. For part two, subtract first
# number from second to get answer

with open("input.txt", "r") as ins:
    blocks = [int(x) for x in ins.read().split("\t")]

history = set()
c = 0
flag = None
while True:
    c += 1
    # get the block with the most (index() already wins the tie correctly)
    starting_index = blocks.index(max(blocks))
    count = blocks[starting_index]
    # zero out the block
    blocks[starting_index] = 0
    i = starting_index
    for x in range(count):
        i += 1
        blocks[i%len(blocks)] += 1
    t = tuple(blocks)
    if (flag is None and t in history) or (flag is not None and t == flag):
        print(c)
        if flag is not None:
            break
        history.clear()
        flag = t
    history.add(t)

