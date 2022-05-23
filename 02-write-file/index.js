const process = require('process');

const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const path1 = path.join(__dirname, 'text.txt');


const output = fs.createWriteStream(path1);

stdout.write('Введите текст:\n');

stdin.on('data', chunk =>{
    const myBuffer = Buffer.from(chunk, 'utf-8');    
    const bufferStringified = myBuffer.toString();    
    if(bufferStringified.match("exit")){    
        console.log("Давай, до свидания!")
        process.exit()
    }
    else {
        output.write(chunk)    
    }
})

process.on('SIGINT', () => {
    console.log("Давай, до свидания!")
    process.exit()
  });

                              