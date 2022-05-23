const fs = require('fs');
const path = require('path');

const path1 = path.join(__dirname,'secret-folder/');


fs.readdir(path1,  (err, files) => {
    if(err) throw err; // не прочитать содержимое папки
    console.log(path1);
    files.forEach(file => {              
        fs.stat(path1 + file, (err1, stats) => {
            if(err1) throw err1;
            if(stats.isFile()){         
                console.log(path.basename(file, path.extname(file)) + ' - ' + path.extname(file).slice(1) + ' - ' + stats.size + ' bytes');
            }                  
        })
    }) 
})


