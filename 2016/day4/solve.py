import collections

'''
Prints out the unencrypted name, simply search output for North Pole to get the sector ID
'''

def getOrd(c, shift):
    if c == '-':
        return ord('-')

    newOrd = (shift % 26 + ord(c))
    if newOrd > ord('z'):
        newOrd -= 26
    return newOrd


i = 0
with open("input.txt", "r") as ins:
    for line in ins:
        data = line.split('-')
        end = data.pop().split('[')
        sector = int(end[0])
        check = end[1].strip()[:-1] # because fuck regex

        freq = sorted(collections.Counter(''.join(data)).most_common(), key=lambda x: (-x[1], x[0]))

        newCheck = ''.join(x[0] for x in freq[0:len(check)])

        if check == newCheck:
            print(''.join(chr(getOrd(char, sector%26)) for char in '-'.join(data)), sector)
            i += sector

print(i)
