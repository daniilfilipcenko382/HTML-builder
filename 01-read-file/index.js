const path = require('path');

const path1 = path.join(__dirname, './text.txt');

const fs = require('fs');

const stream = fs.createReadStream(path1, 'utf-8');

let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));
stream.on('error', error => console.log('Error', error.message));