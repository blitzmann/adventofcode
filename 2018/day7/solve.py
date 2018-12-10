from datetime import datetime
import re
import pprint
with open("input.txt", "r") as ins:
    input = ins.read()

# convert all lines to (datetime, message) tuples

regex = r"\Step (.+) must be finished before step (.+) can begin."
matches = re.finditer(regex, input, re.MULTILINE)

graph = {}
graph_dependancies = {}

for match in matches:
    first = match.group(1)
    second = match.group(2)
    if first not in graph:
        graph[first] = []
    if  second not in graph_dependancies:
        graph_dependancies[second] = []
    graph[first].append(second)
    graph_dependancies[second].append(first)

def find_starts(graph):
    nodes = graph.keys()
    starts = []  # apparently, can have multiple "starts"
    for node in nodes:
        for k, v in graph.items():
            if node in v:
                break
        else:
            starts.append(node)
            continue
    return starts

result = ''
working_list = find_starts(graph)

while len(working_list) != 0:
    working_list = sorted(working_list)
    next_thing = None

    # find the next route (we need to make sure it has it's dependancies fulfilled)
    for x in working_list:
        if next_thing is not None:
            break
        for y in graph_dependancies.get(x, []):
            if y not in result:
                break
        else:
            next_thing = x

    working_list.remove(next_thing)
    # this whole list / set / list thing is a hacky way of making sure we remove duplicates that might creep up
    working_list = list(set(working_list + graph.get(next_thing, [])))
    result += next_thing

print(result)

