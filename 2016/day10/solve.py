import re

instructions = []
bots = {}

with open('input.txt', 'r') as file:
    for line in file:
        numbers = re.findall('\d+', line)
        if line.startswith("value"):
            if int(numbers[1]) not in bots:
                bots[int(numbers[1])] = set()
            bots[int(numbers[1])].add(int(numbers[0]))
            print(len(bots[int(numbers[1])]))
        else:

            instructions.append((int(numbers[0]),int(numbers[1]),int(numbers[2])))
print(bots)
print(instructions)


