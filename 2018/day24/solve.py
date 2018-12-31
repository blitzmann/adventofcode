import re
from collections import OrderedDict
import math


class Army(list):
    armies = []

    def __init__(self, name):
        super().__init__()
        self.name = name
        self.__class__.armies.append(self)

    @property
    def units(self):
        return sum([g.units for g in self])

    def append(self, group):
        super().append(group)
        group.army = self

    def reset(self):
        for g in self:
            g.reset()

    def boost(self, boost):
        for g in self:
            g.set_boost(boost)

    def __repr__(self):
        return "Army<name={}, units={}>".format(self.name, self.units)


class Group():
    def __init__(self, input):
        match = re.match(r"(\d+) units each with (\d+) hit points\s?(\((.+)\))? with an attack that does (\d+) (\w+) damage at initiative (\d+)", input)
        self.__input = input

        self.units_orig = int(match.group(1))
        self.units = self.units_orig

        self.hp = int(match.group(2))
        self.attack_power = int(match.group(5))
        self.dmg_type = match.group(6)
        self.initiative = int(match.group(7))
        self.boost = 0
        self.weaknesses = []
        self.immunities = []

        self.army = []  # this will be set when the group is added to the army

        if match.group(4):
            split = [x.strip() for x in match.group(4).split(';')]
            for x in split:
                if x.startswith("weak to "):
                    x = x.replace("weak to ","")
                    self.weaknesses = [w.strip() for w in x.split(',')]
                    pass
                if x.startswith("immune to "):
                    x = x.replace("immune to ","")
                    self.immunities = [i.strip() for i in x.split(',')]

    @property
    def effective_power(self):
        return self.units * (self.attack_power + self.boost)

    @property
    def group(self):
        return self.army.index(self) + 1

    @property
    def total_hp(self):
        return self.units * self.hp

    @property
    def dead(self):
        return self.units == 0

    def set_boost(self, boost):
        self.boost = boost

    def reset(self):
        self.units = self.units_orig

    def attack_dmg(self, defending_group):
        if self.dmg_type in defending_group.immunities:
            return 0
        if self.dmg_type in defending_group.weaknesses:
            return self.effective_power * 2
        return self.effective_power

    def attack(self, defending_group):
        dmg = self.attack_dmg(defending_group)

        units_left = max(0, int(math.ceil((defending_group.total_hp - dmg)/defending_group.hp)))
        units_killed = min(defending_group.units, defending_group.units - units_left)
        defending_group.units = units_left

        return (units_killed, units_left)

    def __repr__(self):
        return "{} Group {} <effective={}, initiative={}, units={}>'".format(self.army.name, self.group, self.effective_power, self.initiative, self.units)


immune = Army("Immune System")
infection = Army("Infection")

with open("input.txt", "r") as ins:
    input = ins.read()
    input = input.strip().split("\n\n")
    # immune system
    for group in input[0].split("\n")[1:]:
        immune.append(Group(group))

    # infection system
    for group in input[1].split("\n")[1:]:
        infection.append(Group(group))

immune_orig = immune
infection_orig = infection

def target_selection():
    # returns a dictionary of which group will target which other group
    ret = OrderedDict()
    groups = [g for g in (infection+immune) if not g.dead]
    groups = sorted(groups, key=lambda x: (x.effective_power, x.initiative), reverse=True)

    for g in groups:
        defending_army = infection if g in immune else immune
        # we choose the one with the highest attack, followed by highest effective, then lastly highest initiative
        real_order = [x for x in sorted(defending_army, key=lambda x: (g.attack_dmg(x), x.effective_power, x.initiative), reverse=True) if x not in ret.values() and not x.dead]
        if len(real_order) == 0:
            continue

        if g.attack_dmg(real_order[0]) == 0:  # double check that the attacker can actually deal damage.
            continue

        # some debugging stuff, can get rid of in favor of real_order
        max_dmg = max([g.attack_dmg(x) for x in defending_army])
        order = [x for x in defending_army if g.attack_dmg(x) == max_dmg]
        #[print("{} group {} would deal defending group {} {} damage {}".format(g.army.name, g.group, x.group, g.attack_dmg(x), '*' if real_order[0] == x else '')) for x in order ]

        ret[g] = real_order[0]

    return ret

def attack(targets):
    # we fight in decresing initiative
    #print("")
    attackers = sorted([t for t in targets.keys() if not t.dead], key=lambda x: x.initiative, reverse=True)
    for attacker in attackers:
        if attacker.dead:
            continue  # this attacker was killed somewhere in this loop, skip them
        defender = targets[attacker]
        killed, left = attacker.attack(defender)
        if killed == 0:
            pass
        #print("{} group {} attacks defending group {}, killing {} units, dead: {}".format(attacker.army.name, attacker.group, defender.group, killed, defender.dead))
        pass
    #print ("="*20)
    pass

def fight():
    while not any(army.units == 0 for army in Army.armies):
        old_unit_count = infection.units, immune.units
        targets = target_selection()
        attack(targets)
        if (infection.units, immune.units) == old_unit_count:
            return True

fight()

print([a for a in Army.armies if a.units != 0][0])

# Couldn't get the stalemate logic worked out correctly, so I just analyze the print out here to determine the answer. I know that test 14 cause thes army to die,
# and this starts at test 15 which starts a series of stalemates. So the next test that the army srurvives is the winner.
# todo: fix the stalemate logic - when hitting a stalemate, it should continue to test in decresing values until it does not hit a stalemate
min_test = 0
max_test = 30
stalemates = set([])

while True:
    for a in Army.armies:
        a.reset()

    if max_test is None:
        # continue testing by adding 2000 to min
        test = min_test + 2000
        immune.boost(test)
        fight()

        if immune.units != 0:
            max_test = test
        else:
            min_test = test
        continue

    test = min_test + int((max_test - min_test) / 2)

    immune.boost(test)
    stalemate = fight()

    if stalemate:
        min_test += 1
        stalemates.add(test)
        print("from {} to {} test: {} stalemate".format(min_test, max_test, test))
        continue

    print("from {} to {} test: {} army died: {}, units: {}".format(min_test, max_test, test, immune.units == 0,immune.units ))

    if immune.units == 0:
        # immune died, our test was not high enough,
        min_test = test
    else:
        max_test = test

    if max_test - min_test == 1:
        print(max_test)
        break


