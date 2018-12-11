from datetime import datetime
import re
import pprint
import string
import pprint

with open("input.txt", "r") as ins:
    input = ins.read()

# this whole thing is slow as balls, but it works

def react(input):
    found_one = True
    while found_one:
        for i, char in enumerate(input):
            try:
                if abs(ord(input[i]) - ord(input[i+1])) == 32:
                    input = input[:i] + input[i+2:]
                    break
            except IndexError:
                pass
        else:
            found_one = False
    return len(input), input

print(react(input))

unit_tests = {}

for char in string.ascii_uppercase:
    input_copy = input
    input_copy = input_copy.replace(char, '')
    input_copy = input_copy.replace(chr(ord(char)+32), '')
    unit_tests[char] = react(input_copy)

    print("{} done: {}".format(char, unit_tests[char]))

pprint.pprint(unit_tests)


