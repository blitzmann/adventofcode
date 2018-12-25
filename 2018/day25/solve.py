constelations = []
points = []

with open("input.txt", "r") as ins:
    for line in ins:
        points.append(tuple(int(n) for n in line.strip().split(',')))


def distance(a, b):
    return abs(a[0]-b[0]) + abs(a[1]-b[1]) + abs(a[2]-b[2]) + abs(a[3]-b[3])


def is_in_constelation(constelation, point):
    for cpoint in constelation:
        if distance(cpoint, point) <=3:
            return True

    return False


working_points = points.copy()

while True:
    new_const = [working_points.pop()]
    constelations.append(new_const)

    old_num = None
    new_num = None
    while old_num is None or old_num != new_num:
        old_num = len(new_const)

        for p in working_points.copy():
            if is_in_constelation(new_const, p):
                new_const.append(p)
                working_points.remove(p)
        new_num = len(new_const)
    if len(working_points) == 0:
        break

print(len(constelations))
