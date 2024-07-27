import re
with open("input.txt", "r") as ins:
    input = ins.read()

units = []

def get_neighbors(target):
    # get left, right, up, and down points that are open
    pass

def get_targets(unit):
    # get position of all opposing units
    return []

while True:  # round
    for u in units:
        targets = get_targets(u)

        point_checks = []
        for t in targets:
            # first, check if the target is within range of the unit. If not, get the possible move to points

            
            point_checks += get_neighbors(t)


        # check to
