import re

ips = []

init = list('.'*8)

matrix = []

for _ in range(6):
    matrix.append(list('.' * 50))

def printMatrix(matrix):
    for x in matrix:
        print(''.join(x))

def rect(matrix, x, y):
    for y2 in range(y):
        for x2 in range(x):
            matrix[y2][x2] = '#'

def rotCol(matrix, x, i):
    col = [y[x] for y in matrix]
    for _ in range(i):
        col.insert(0, col.pop())
    for i, y in enumerate(matrix):
        y[x] = col[i]

def rotRow(matrix, y, i):
    row = matrix[y]
    for _ in range(i):
        row.insert(0, row.pop())

def countPixels(matrix):
    i = 0
    for y, _ in enumerate(matrix):
        for x in matrix[y]:
            i += 1 if x == '#' else 0
    return i

with open('input.txt', 'r') as file:
    for line in file:
        numbers = re.findall('\d+', line)
        if line.startswith("rect"):
            func = rect
        elif line.startswith("rotate column"):
            func = rotCol
        elif line.startswith("rotate row"):
            func = rotRow

        func(matrix, int(numbers[0]), int(numbers[1]))

print(printMatrix(matrix))
print(countPixels(matrix))
