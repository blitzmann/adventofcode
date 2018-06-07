with open("input.txt", "r") as ins:
    string = ins.read()

length = len(string)
half = int(length / 2)

digits = []

# Part 1
for i, x in enumerate(string):
    t = (i+1) % length
    if x == string[t]:
        digits.append(int(x))

print(sum(digits))

# Part 2
digits.clear()
for i, x in enumerate(string):
    t = (i+half) % length
    if x == string[int(t)]:
        digits.append(int(x))

print(sum(digits))