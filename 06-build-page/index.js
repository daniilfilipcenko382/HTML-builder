const fs = require('fs')
const path = require('path');

const componentsPath = path.join(__dirname, 'components');
const project_distPath = path.join(__dirname, 'project-dist');

//создаем папку project-dist
const file = 'project-dist';
fs.access(file, (err) => {
    if(err){
        fs.mkdir(__dirname + '/project-dist', () => { 
            console.log('Папка успешно создана')
        })
    }   
});

//проверяем нужную папку
function readComponents (src) {
fs.readdir(src, {withFileTypes: true}, (err, files)=> {
	if(err) {
		console.error(err)
		return
	}
    //читаем template.html и вытаскиваем тэги
    const templatePath = path.join(__dirname, 'template.html');
    const streamTemplate = fs.createReadStream(templatePath, 'utf-8');

    let template = '';

    streamTemplate.on('data', chunk => template += chunk);
    streamTemplate.on('error', error => console.log('Error', error.message));
    streamTemplate.on('end', () => {
        const regexp = /{{(.*?)}}/g;
        const tags = template.match(regexp);
        //перебираем теги и файлы, подставляем нужное      
        tags.forEach(item => {        
            for(let i = 0; i < files.length; i++) {   
                let filesPath = path.join(src,files[i].name);              
                if (files[i].isFile() && path.extname(files[i].name) === '.html' && `{{${files[i].name.split('.')[0]}}}` === item){                   

                    let file = '';

                    const readStream = fs.createReadStream(filesPath, 'utf-8');
                    readStream.on('data', chunk => file += chunk);
                    readStream.on('end', () => {
                        template = template.replace(item, file);
                        const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
                        writeStream.write(template);
                    })
                }
            }
        })
    })
})
}

const path_to_styles = path.join(__dirname, 'styles')
let arr_with_tyles = [];

fs.readdir(path_to_styles, {withFileTypes: true}, (err, files)=> {

	if(err) {
		console.error(err)
		return
	}
	for(let i = 0; i < files.length; i++) {
		const fileType = path.extname(files[i].name).slice(1)
		
		if(fileType == 'css') {
			const path_to_fileCss = path.join(path_to_styles, files[i].name);			
			fs.readFile(path_to_fileCss, 'utf8', (err, fileCss)=> {
				arr_with_tyles.push(fileCss)
				// console.log(arr_with_tyles)
	
				fs.writeFile(
					path.join(project_distPath, 'style.css'),
					arr_with_tyles.join(''),
					(err) => {
						if (err) throw err;
						console.log('Файл был создан');
					}
				);
			})
		}
	}
})
        
       

const assetsFolder = 'assets';
const oldDir = __dirname + '\\assets';
const newDir = __dirname + '/project-dist/assets';

fs.access(assetsFolder, (err) => {
    if(err){
        fs.mkdir(__dirname + '/project-dist/assets', () => { 
            console.log('Папка успешно создана')
        })
    }   
})
const { readdir, copyFile, rm, mkdir } = require('fs/promises');
const dirPath = path.join(__dirname, '\\assets');
const dirCopyPath = path.join(__dirname, '/project-dist/assets');

async function copyDir(dir, dirCopy) {
  const dirFiles = await readdir(dir, {withFileTypes: true});
  dirFiles.forEach(async function (data) {
    if (data.isFile()) {
      copyFile(dir + '\\' + data.name, dirCopy + '\\' + data.name);
    } else if (data.isDirectory()) {
      await mkdir(dirCopy + '\\' + data.name);
      await copyDir(dir + '\\' + data.name, dirCopy + '\\' + data.name);
    }
  });
}

(async function () {
  await rm(dirCopyPath, {recursive: true, force: true});
  await mkdir(dirCopyPath);
  copyDir(dirPath, dirCopyPath);
})();

function copyDir(oldD, newD) {    
    //Чтение файла   
    fs.readdir(oldD, {withFileTypes: true}, (err, data) => {
            if (err) {
                console.error(err)
            return
            }
             

            for(let i = 0; i < data.length; i++) {
                const nameFile = data[i].name;              

                if(data[i].isFile()) {     
                    fs.copyFile(`${oldD}/${nameFile}`, `${newD}/${nameFile}`, err => {
                        if(err) throw err; // не удалось скопировать файл  			
                    })
                } 

                if (data[i].isDirectory()){ 
                        fs.mkdir(newD + '\\' + nameFile, () => {
                            console.log('Папка ' + nameFile + ' успешно создана')
                            copyDir(oldD + '\\' + nameFile, newD + '\\' + nameFile) 
                        })
                }

            }
    })
}

readComponents(componentsPath) 
copyDir(oldDir, newDir)      







