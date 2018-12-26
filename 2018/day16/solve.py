import re

with open("input.txt", "r") as ins:
    input = ins.read()
    part1_input, part2_input = input.split('\n\n\n')

# these could probably be converted to lambda functions
def op_addr(r, a, b, c):
    """addr (add register) stores into register C the result of adding register A and register B."""
    r[c] = r[a] + r[b]
    return r

def op_addi(r, a, b, c):
    """addi (add immediate) stores into register C the result of adding register A and value B."""
    r[c] = r[a] + b
    return r

def op_mulr(r, a, b, c):
    """mulr (multiply register) stores into register C the result of multiplying register A and register B."""
    r[c] = r[a] * r[b]
    return r

def op_muli(r, a, b, c):
    """muli (multiply immediate) stores into register C the result of multiplying register A and value B."""
    r[c] = r[a] * b
    return r

def op_banr(r, a, b, c):
    """banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B."""
    r[c] = r[a] & r[b]
    return r

def op_bani(r, a, b, c):
    """bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B."""
    r[c] = r[a] & b
    return r

def op_borr(r, a, b, c):
    """borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B."""
    r[c] = r[a] | r[b]
    return r

def op_bori(r, a, b, c):
    """bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B."""
    r[c] = r[a] | b
    return r

def op_setr(r, a, b, c):
    """setr (set register) copies the contents of register A into register C. (Input B is ignored.)"""
    r[c] = r[a]
    return r

def op_seti(r, a, b, c):
    """seti (set immediate) stores value A into register C. (Input B is ignored.)"""
    r[c] = a
    return r

def op_gtir(r, a, b, c):
    """gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0."""
    r[c] = 1 if a > r[b] else 0
    return r

def op_gtri(r, a, b, c):
    """gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0."""
    r[c] = 1 if r[a] > b else 0
    return r

def op_gtrr(r, a, b, c):
    """gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0."""
    r[c] = 1 if r[a] > r[b] else 0
    return r

def op_eqir(r, a, b, c):
    """eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0."""
    r[c] = 1 if a == r[b] else 0
    return r

def op_eqri(r, a, b, c):
    """eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0."""
    r[c] = 1 if r[a] == b else 0
    return r

def op_eqrr(r, a, b, c):
    """eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0."""
    r[c] = 1 if r[a] == r[b] else 0
    return r

opcodes = {
    'addi': op_addi,
    'addr': op_addr,
    'muli': op_muli,
    'mulr': op_mulr,
    'bani': op_bani,
    'banr': op_banr,
    'bori': op_bori,
    'borr': op_borr,
    'eqir': op_eqir,
    'eqri': op_eqri,
    'eqrr': op_eqrr,
    'gtir': op_gtir,
    'gtri': op_gtri,
    'gtrr': op_gtrr,
    'seti': op_seti,
    'setr': op_setr
}

opcodes_inv = {v: k for k, v in opcodes.items()}
known_ops = {}

regex = r"Before: \[(.+)\]\n(.+)\nAfter:\s+\[(.+)\]"
matches = re.finditer(regex, part1_input, re.MULTILINE)

ops = opcodes.values()
tests = []
part_1_store = {}
for m in matches:
    before = tuple([int(x) for x in m.group(1).split(',')])
    command = tuple([int(x) for x in m.group(2).split(' ')])
    after = tuple([int(x) for x in m.group(3).split(',')])
    tests.append((before, command, after))

# the logic for this part is very similar to the logic in part two. Probably a way to combine these
for t in tests:
    possible_ops = []
    for name, op in opcodes.items():
        if tuple(op(list(t[0]), t[1][1], t[1][2], t[1][3])) == t[2]:
            possible_ops.append(name)

    if len(possible_ops) == 1:
        known_ops[t[1][0]] = opcodes[possible_ops[0]]

    part_1_store[t] = possible_ops

print(len([v for x, v in part_1_store.items() if len(v) >= 3]))

while len(known_ops.keys()) < len(opcodes.keys()):
    # we loop through each test, knowing now what we know from previous loops, to narrow down which test uses which op
    for t in tests:
        if t[1][0] in known_ops:
            continue
        possible_ops = set([])
        for name, op in opcodes.items():
            if tuple(op(list(t[0]), t[1][1], t[1][2], t[1][3])) == t[2]:
                possible_ops.add(name)

        # remove the known ops (todo: better yet, don't test the known ops above)
        possible_ops = possible_ops - set([opcodes_inv[x] for x in known_ops.values()])

        # if, once we remove the known ops, it leaves one, then the test's op should be the one that's left
        if len(possible_ops) == 1:
            known_ops[t[1][0]] = opcodes[possible_ops.pop()]
    pass

# now that we know all the opcodes, simply run the commands given that operate on the registers
r = [0, 0, 0, 0]
for line in part2_input.strip().split("\n"):
    op, a, b, c = [int(x) for x in line.split(" ")]
    known_ops[op](r, a, b, c)

print(r[0])
