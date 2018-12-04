freq_seen = set()
duplicate = None
num = 0

with open("input.txt", "r") as ins:
    lines = list(ins)

for line in lines:
    num = eval('{}{}'.format(num, line))  # just do this in the initial for loop

print(num)
num = 0   # reset num
while duplicate is None:
    for line in lines:
        if num in freq_seen:
            duplicate = num
            break
        else:
            freq_seen.add(num)

        num = eval('{}{}'.format(num, line))

print(duplicate)