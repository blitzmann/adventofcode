import hashlib
state = []

with open("input.txt", "r") as ins:
    for x in ins:
        state.append(list(x.strip()))


def get_adjacent(x, y):
    ret = []
    for dy in range(max(0, y - 1), min(y + 2, len(state))):
        for dx in range(max(0, x - 1), min(x + 2, len(state[dy]))):
            if (dx, dy) == (x, y):
                continue
            ret.append(state[dy][dx])
    return ret

def get_new_value(x, y):
    adjacent = get_adjacent(x, y)

    if state[y][x] == '.' and adjacent.count('|') >= 3:
        return '|'
    if state[y][x] == '|' and adjacent.count('#') >= 3:
        return '#'
    if state[y][x] == '#' and (adjacent.count('|') == 0 or adjacent.count('#') == 0):
        return '.'

    return state[y][x]  # return old value

def do_minute():
    new_state = []

    for y, data in enumerate(state):
        new_state.append([get_new_value(x, y) for x, _ in enumerate(data)])

    state_str = ''.join([x for sublist in state for x in sublist])
    return new_state, hashlib.sha3_256(state_str.encode('utf-8')).hexdigest(), state_str.count('#') * state_str.count('|')
from collections import OrderedDict
minute_hashes = OrderedDict()

for _ in range(10):
    state, hash, resources = do_minute()
    minute_hashes[hash] = resources

data = ''.join([x for sublist in state for x in sublist])
print(data.count('#') * data.count('|'))

while True:
    # keep going until we find a duplicate hash
    state, hash, resources = do_minute()
    if hash in minute_hashes:
        # find the period that repeats
        start_idx = list(minute_hashes).index(hash)  # 476
        period = len(minute_hashes) - start_idx
        break
    minute_hashes[hash] = resources

# we can deduct the first minutes that don't repeat, and then modulo the period to get the iteration number that we're looking for
remainder = (1000000000 - len(minute_hashes)) % period

print(minute_hashes[list(minute_hashes)[start_idx + remainder]])
