'''
Some comments:

We don't know our bounds, so to avoid creating a huge matrix that we then fill in, we're only keep track of points that
we know about (have visited) in the map dictionary, where the key is the offset from (0, 0)

I noticed early on that the "optional" branches eg: (SWEN|) always have 1 option, and always end at the start.
The instructions, to me, aren't very clear in this regard - both in the fact that they come back to the start, and that
they only support 1 option. They give the example of (NEWS|WNSE|), where multiple optional branches are defined, however
I never ran into this particular situation. I exploit the fact that it always comes back from to the start by halving
the directions going into the recursive function (so NEWS becomes NE).
'''

with open("input.txt", "r") as ins:
    input = ins.read()

# lop off the ends
inputTrimmed = input[1:-1]

direction_mod = {
    "N": (0, 2),
    "W": (-2, 0),
    "E": (2, 0),
    "S": (0, -2)
}

map = {}  # dictionary of (x_offset, y_offset): coord type (room or door)
room_distance = {}  # keeps track of shortest distance to room. Once a room has been visited, it's listed here


def go_through_door(position, direction):
    door_pos = tuple(sum(x) for x in zip(position, tuple(int(x/2)for x in direction_mod[direction])))
    room_pos = tuple(sum(x) for x in zip(position, direction_mod[direction]))

    map[door_pos] = '-' if direction in ('N', 'S') else '|'
    map[room_pos] = '.'

    return room_pos


def run(current_pos, input, current_distance=0):
    '''
    The main recursive function that builds the map. This function operates on the input into two main chunks:
       a) The first basic sequence that it finds
       b) The first branching sequence that it finds
    The first part is easy - it simply runs a simulation of going through the door until we reach "(". The next bit
    iterates over the different branches that it finds and calls run() again, with the branch as the input + the tail
    end of the previous input (the part that wasn't considered in a) and b)). We also keep track of distance (or
    iteration step) so that we can keep track of that per room
    '''

    # iterate over input to process basic sequence and find branching
    open_paren = 0
    open_close_idx = [None, None]
    for i, a in enumerate(input):
        if a in ('(', ')'):
            if open_paren == 0:
                open_close_idx[0] = i
            if a == '(':
                open_paren += 1
            if a == ')':
                open_paren -= 1
            if open_paren == 0:
                open_close_idx[1] = i
                break  # found the end of the branch sequences, break
        elif open_paren == 0:
            # do room stuff
            current_distance += 1
            current_pos = go_through_door(current_pos, a)
            room_distance[current_pos] = min(current_distance, room_distance.get((current_pos), 1e9999))

    optional_branch = False
    if tuple(open_close_idx) != (None, None):
        branch_input = input[open_close_idx[0]+1:open_close_idx[1]]

        # find the different branches
        open_paren = 0
        branch_idxs = [-1]
        for i, a in enumerate(branch_input):
            # we only care about pipes that aren't in parenthesis
            if open_paren == 0 and a == '|':
                branch_idxs.append(i)
            if a == '(':
                open_paren += 1
            if a == ')':
                open_paren -= 1
        branches = [branch_input[i+1:j] for i, j in zip(branch_idxs, branch_idxs[1:] + [None])]

        if branches[-1] == '':
            # this is an optional branch - simply run it, and flag this as true
            # half the sequence because optional branches always (for my map) end where they started (yay optimization!)
            run(current_pos, branches[0][:int(len(branches[0])/2)], current_distance)
            optional_branch = True
        else:
            for branch in branches:
                # run each branch through the simulation, and append the remaining sequence to them
                run(current_pos, branch+input[open_close_idx[1]+1:], current_distance)

    # we had an optional branch. Since the first bit of this algorithm only looks for the first literal sequence, and
    # then branches, and then stops, we now have to re-run the function from where we left off
    if optional_branch:
        run(current_pos, input[open_close_idx[1]+1:], current_distance)


run((0, 0), inputTrimmed)
map[(0, 0)] = "X"

print(max(room_distance.values()))
print(len([x for x in room_distance.values() if x >= 1000]))

# map printing stuff
points = map.keys()
max_x = max(points, key=lambda x:x[0])[0]
max_y = max(points, key=lambda x:x[1])[1]
min_x = min(points, key=lambda x:x[0])[0]
min_y = min(points, key=lambda x:x[1])[1]

for y in reversed(range(min_y-1, max_y+2)):
    print(''.join([map.get((x, y), '#') for x in range(min_x-1, max_x+2)]))
