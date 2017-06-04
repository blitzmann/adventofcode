import hashlib

door = 'cxdnnyjw'
password = ''
i = 0

while len(password) != 8:
    hash = hashlib.md5(door + str(i)).hexdigest()

    if hash[:5] == '00000':
        password += str(hash[5])

    i += 1

print password

# Part 2
print "="*20

password = list('________')
i = 0

while '_' in password:
    hash = hashlib.md5(door + str(i)).hexdigest()

    if hash[:5] == '00000':
        if hash[5].isdigit():
            test = int(hash[5])
            if test < 8 and password[test] == '_':
                password[test] = hash[6]

    i += 1

print ''.join(password)
