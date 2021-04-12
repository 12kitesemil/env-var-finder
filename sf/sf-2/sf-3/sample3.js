var SAMPLE_VAR_A3 = process.env.SAMPLE_VAR_A3 || 'fahsgfuw7236jlg2547ljhq3g46v2c7hl48k245ym2g45g2q4g'

const directoriesToSkip = ['node_modules'];
let paths = [];

const readDir = (directory) => {
    let currentDirectorypath = path.join(__dirname + directory);
    let currentDirectory = fs.readdirSync(currentDirectorypath, 'utf8');

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