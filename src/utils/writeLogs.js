const path = require("path");
const fs = require("fs");

function writeLogs(source, logs) {
    try{
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const day = new Date().getDate();
        const time = new Date().toLocaleTimeString()

        const logText = `[${year}/${month}/${day}]-[${time}] = [${source}]: ${logs} \n\n`;
        const pathToLogs = path.join(__dirname, '../logs/errors', `error.txt`);
        const log = fs.createWriteStream(pathToLogs, { flags: 'a' });

        log.write(logText);

        log.end();
    } catch(e){
        console.log('LOG WRITING ERROR:\n', e);
    }
}

module.exports = { writeLogs }

