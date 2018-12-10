from datetime import datetime
import re
import pprint
with open("input.txt", "r") as ins:
    input = ins.read()

# convert all lines to (datetime, message) tuples

regex = r"\[(.+)\] (.+)"
matches = re.finditer(regex, input , re.MULTILINE)

conv_lines = []

for match in matches:
    datetime_object = datetime.strptime(match.group(1), '%Y-%m-%d %H:%M')
    conv_lines.append((datetime_object, match.group(2)))

sorted_data = sorted(conv_lines, key=lambda x: x[0])

current_guard = None
is_asleep = None
schedule = {}
guard_tracker = {}

for i, info in enumerate(sorted_data):
    date, text = info

    if "begins shift" in text:
        guard_regex = r"#(\d+)"
        matches = re.findall(guard_regex, text)
        current_guard = int(matches[0])
        is_asleep = None
        if current_guard not in guard_tracker:
            guard_tracker[current_guard] = 0
        continue  # if this is a shift start, then continue to next loop

    key = (date.month, date.day), current_guard
    if key not in schedule:
        schedule[key] = [False for x in range(60)]

    if "falls" in text:
        is_asleep = True

    if "wakes" in text:
        # woke up, get minute that he fell asleep (previous iteration)
        prev_date = sorted_data[i-1][0]
        minute_range = date.minute - prev_date.minute
        guard_tracker[current_guard] += minute_range
        for x in range(minute_range):
            schedule[key][prev_date.minute + x] = True


# print schedule
for key, minutes in schedule.items():
    print("{} {} {}".format(key[0], key[1], ''.join("#" if y else "." for y in minutes)))

# part 1: getting the guard with the most minutes asleep, and finding which minute is most
guard_most_minutes = max(guard_tracker, key=lambda x: guard_tracker[x])

# get a list of all days this guard worked
guard_days = [minutes for x, minutes in schedule.items() if x[1] == guard_most_minutes]
# logs which minute guard is asleep the most
guard_minutes = {x: 0 for x in range(60)}

for day in guard_days:
    for minute, asleep in enumerate(day):
        guard_minutes[minute] += 1 if asleep else 0

minute_most_sleep = max(guard_minutes, key=lambda x: guard_minutes[x])

print(guard_most_minutes * minute_most_sleep)

# part two, getting the guard with the most frequently asleep minute

guard_minute_map = {}
for key, minutes in schedule.items():
    for i, asleep in enumerate(minutes):
        key2 = key[1], i
        if key2 not in guard_minute_map:
            guard_minute_map[key2] = 0
        guard_minute_map[key2] += 1 if asleep else 0

minute_most_freq = max(guard_minute_map, key=lambda x: guard_minute_map[x])

print(minute_most_freq[0] * minute_most_freq[1])