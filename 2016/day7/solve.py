import re

ips = []

def hasABBA(s):
    for i, c in enumerate(s):
        if i == len(s)-3: return False
        test = s[i:i + 4]
        if test[0] == test[3] and test[1] == test[2] and test[0] != test[1]:
            return True
    return False

with open('input.txt', 'r') as file:
    for line in file:
        line = line.strip()
        regex = ur"\[(.*?)\]"
        brackets = re.findall(regex, line)

        for x in brackets:
            if hasABBA(x):
                break
        else:
            line = re.sub(regex, " ", line)
            for z in line.split():
                if hasABBA(z):
                    ips.append(line)
                    break

print len(ips)

print "="*200

# Part 2

ips = []

def getBAB(s):
    babs = []
    for i, c in enumerate(s):
        if i == len(s)-2: break
        test = s[i:i + 3]
        if test[0] == test[2] and test[0] != test[1]:
            babs.append((test[0], test[1]))
    return babs

def searchABA(s, babs):
    for i, c in enumerate(s):
        if i == len(s)-2: return False
        test = s[i:i + 3]

        if test[0] == test[2] and test[0] != test[1] and (test[1], test[0]) in babs:
            return True
    return False

with open('input.txt', 'r') as file:
    for line in file:
        line = line.strip()
        regex = ur"\[(.*?)\]"
        brackets = re.findall(regex, line)

        babs = []
        for x in brackets:
            babs.extend(getBAB(x))

        line = re.sub(regex, " ", line)
        for z in line.split():
            if searchABA(z, babs):
                ips.append(line)
                break

print len(ips)
