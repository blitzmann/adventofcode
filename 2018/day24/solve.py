import re
from collections import OrderedDict
import math


class Group(object):
    def __init__(self, army, input):
        match = re.match(r"(\d+) units each with (\d+) hit points\s?(\((.+)\))? with an attack that does (\d+) (\w+) damage at initiative (\d+)", input)
        self.__input = input
        self.army = army
        self.units = int(match.group(1))
        self.hp = int(match.group(2))
        self.attack_power = int(match.group(5))
        self.dmg_type = match.group(6)
        self.initiative = int(match.group(7))
        self.weaknesses = []
        self.immunities = []

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
        return self.units * self.attack_power

    @property
    def group(self):
        return self.army.index(self) + 1

    @property
    def total_hp(self):
        return self.units * self.hp

    @property
    def dead(self):
        return self.units == 0

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

class Army(list):
    def __init__(self, name):
        super().__init__()
        self.name = name

immune = Army("Immune System")
infection = Army("Infection")

with open("input.txt", "r") as ins:
    input = ins.read()
    input = input.strip().split("\n\n")
    # immune system
    for group in input[0].split("\n")[1:]:
        immune.append(Group(immune, group))

    # infection system
    for group in input[1].split("\n")[1:]:
        infection.append(Group(infection, group))


def target_selection():
    # returns a dictionary of which group will target which other group
    ret = OrderedDict()
    groups = [g for g in (infection+immune) if not g.dead]
    groups = sorted(groups, key=lambda x: (x.effective_power, x.initiative), reverse=True)

    for g in groups:
        defending_army = infection if g in immune else immune
        # we choose the one with the highest attack, followed by highest effective, then lastly highest initiative
        real_order = sorted(defending_army, key=lambda x: (g.attack_dmg(x), x.effective_power, x.initiative), reverse=True)

        # some debugging stuff, can get rid of in favor of real_order
        max_dmg = max([g.attack_dmg(x) for x in defending_army])
        order = [x for x in defending_army if g.attack_dmg(x) == max_dmg]
        [print("{} group {} would deal defending group {} {} damage {}".format(g.army.name, g.group, x.group, g.attack_dmg(x), '*' if real_order[0] == x else '')) for x in order ]

        ret[g] = real_order[0]

    return ret

def attack(targets):
    # we fight in decresing initiative
    print("")
    attackers = sorted([t for t in targets.keys() if not t.dead], key=lambda x: x.initiative, reverse=True)
    for attacker in attackers:
        if attacker.dead:
            continue  # this attacker was killed somewhere in this loop, skip them
        defender = targets[attacker]
        killed, left = attacker.attack(defender)
        print("{} group {} attacks defending group {}, killing {} units, dead: {}".format(attacker.army.name, attacker.group, defender.group, killed, defender.dead))
        pass
    print ("="*20)
    pass

def fight():
    while True:
        targets = target_selection()
        attack(targets)

fight()

