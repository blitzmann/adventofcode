s = ''

with open('input.txt', 'r') as file:
    for line in file:
        s += line.strip()

decompress = ''

i = 0
while i < len(s):
    c = s[i]
    if c == "(":  # start finding our expansion variables
        start = i
        end = None
        for i2, c2 in enumerate(s[i:]):
            if c2 == ")":
                end = i + i2
                thing = s[start+1:end].split('x')
                break
        else:
            start = None
        r = end + 1
        t = r + int(thing[0])
        decompress += s[r:t] * int(thing[1])
        i = t  # set i to the new position
    else:
        decompress += c
        i += 1

print(decompress)
print(len(s), len(decompress))

# Part 2
#    01234567890123456789
s = '(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN'

i = 0

def readCompressionData(s, start):
    end = None
    multiplier = 1
    for i2, c2 in enumerate(s[start:]):
        if c2 == ")":
            end = start + i2
            thing = [int(f) for f in s[start + 1:end].split('x')]
            if s[end + 1] == '(':
                thing2, end2 = readCompressionData(s, end+1)
                thing[1] = thing[1] * thing2[1]
                thing[0] = thing2[0]
                end = end2

            return thing, end

decompressLen = 0
while i < len(s):
    c = s[i]
    if c == "(":  # start finding our expansion variables
        thing, end = readCompressionData(s, i)
        r = end + 1
        t = r + int(thing[0])
        decompressLen += len(s[r:t])* thing[1]
        i = t  # set i to the new position
    else:
        decompressLen += 1
        decompress += c
        i += 1

print(decompressLen)