from collections import Counter

lines = []

with open('input.txt', 'r') as file:
    for line in file:
        lines.append(line)

# Part 1

answer = ''
for i in range(len(lines[0])-1):
    answer += Counter([x[i] for x in lines]).most_common(1)[0][0]
print(answer)

# Part 2

answer = ''
for i in range(len(lines[0])-1):
    answer += Counter([x[i] for x in lines]).most_common()[-1][0]
print(answer)

