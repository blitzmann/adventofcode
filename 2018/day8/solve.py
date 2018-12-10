freq_seen = set()
duplicate = None
num = 0

with open("input.txt", "r") as ins:
    lines = [int(x) for x in ins.read().split(' ')]

def recursive(lines, idx):
    num_children = lines[idx]
    num_metadata = lines[idx + 1]
    metadata = []
    local_meta = []
    child_values = []

    idx += 2

    for i in range(num_children):
        idx, rec_meta, value = recursive(lines, idx)
        child_values.append(value)
        metadata += rec_meta

    for i in range(num_metadata):
        local_meta.append(lines[idx])
        idx += 1

    value = 0
    if num_children == 0:
        value = sum(local_meta)
    else:
        for x in local_meta:
            try:
                value += child_values[x-1]
            except IndexError:
                value += 0

    # return the ending idx, and the metadata for this step
    return idx, metadata + local_meta, value

# kickoff start
ending_idx, meta, value = recursive(lines, 0)

print(sum(meta))

print(value)