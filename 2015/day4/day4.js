var crypto = require('crypto');

let i = 0;
const key = 'ckczppom';
while (true) {
    i++;
    if (
        crypto
            .createHash('md5')
            .update(key + i)
            .digest('hex')
            .startsWith('00000')
    ) {
        console.log(i);
        break;
    }
}

while (true) {
    i++;
    if (
        crypto
            .createHash('md5')
            .update(key + i)
            .digest('hex')
            .startsWith('000000')
    ) {
        console.log(i);
        break;
    }
}
