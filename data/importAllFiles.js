const exec = require('child_process').exec;
var yourscript = exec('import.sh',
(error, stdout, stderr) => {
    console.log(`${stdout}`);
    console.log(`${stderr}`);
    if (error !== null) {
        console.log(`exec error: ${error}`);
    }
});
