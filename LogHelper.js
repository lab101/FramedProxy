import fs from 'fs';

function appendTimeStamp(log) {
  return new Date().toISOString() + ' ' + log;
}

function logToFileAndConsole(log) {
  console.log(appendTimeStamp(log));
  logToFile(log);
}

function logToFile(log,logName="main") {

  checkLogFolder();
  log = appendTimeStamp(log);
  fs.appendFile("logs/" + logName + '.txt', log + '\n', function (err) {
    if (err) throw err;
  });
}


function logPerHour(log)
{
  checkLogFolder();

  var now = new Date();
  var hour = now.getHours();
  var day = now.getDate();
  var month = now.getMonth();
  var year = now.getFullYear();
  
  var logName =  "logs/log" + year + month + day + hour;
  log = appendTimeStamp(log);
  fs.writeFile(logName + '.txt', log, function (err) {
    if (err) throw err;
  });
  
}

function checkLogFolder()
{
  if (!fs.existsSync('logs')){
    fs.mkdirSync('logs');
  }
}


export {logToFile,logPerHour,logToFileAndConsole};