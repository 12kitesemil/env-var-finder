'use strict'

//1. go through file structure and get paths to all .js files (exclude node_modules)
//2. read through those files and find lines with env vars
//2a. keep/strip the values?
//3. create a list of env vars
//4. create a .txt file with the vars

const fs = require('fs')
const path = require('path')


const directoriesToSkip = ['node_modules'];
let paths = [];

const readDir = (directory = '/') => {
    let currentDirectoryPath = path.join(__dirname + directory);
    let currentDirectory = fs.readdirSync(currentDirectoryPath, 'utf8');

    currentDirectory.forEach(file => {
        let fileShouldBeSkipped = directoriesToSkip.indexOf(file) > -1;
        let pathOfCurrentItem = path.join(__dirname + directory + '/' + file);
        if (!fileShouldBeSkipped && fs.statSync(pathOfCurrentItem).isFile()) {
          if(path.extname(pathOfCurrentItem) == '.js') {
            paths.push(pathOfCurrentItem);
          }
        }
        else if (!fileShouldBeSkipped) {
            let directorypath = path.join(directory + '/' + file);
            readDir(directorypath);
        }
    });
}


const readFile = path => {
  const content = fs.readFileSync(path, 'utf8')
  return content
}


const findEnvLines = (paths, details = false) => {
  const lines = []

  if(!paths) {
    console.log('Paths array is empty.')
  } else {
    let res = null

    paths.forEach(path => {
      let content = readFile(path)
      let pattern = /.*(process.env).*/g
      let res = content.match(pattern)
      
      lines.push(res)
    })

    if(details) {
      res = lines.flat().join('\n')
      return res
    } else {
      let data = lines.flat()

      let stripValue = data.map( line => line.split('=')[0])
      let stripDeclarationWord = stripValue.map(line => {
        let pattern = /^\s*(const|let|var)\s+/g
        let res = line.replace(pattern, '')
        return res
      })
      res = stripDeclarationWord.join('\n')

      return res
    }
  }
}


const createTxtFile = data => {
  fs.writeFileSync('env-vars.txt', data)
}


const init = options => {
  let startDir = options.startDir
  let details = options.details
  let txtFile = options.txtFile
  
  readDir(startDir);

  let result = findEnvLines(paths, details)

  if(txtFile) {
    createTxtFile(result)
  }
  console.log(result)

  return result
}

const options = {
  startDir: process.argv[2] || '/sf',
  details: process.argv[3] || false,
  txtFile: process.argv[4] || false
}



init(options)