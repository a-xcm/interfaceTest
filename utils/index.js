//读取文件
const fs = require('fs');
const path = require('path');
const spFile = require('./file')

//写入日志
function writeLog(content) {
  const nowDate = new Date();
  const year = nowDate.getFullYear();
  const month = nowDate.getMonth() + 1;
  const date = nowDate.getDate();
  //判断文件是否存在
  const logPath = path.join(__dirname, `../logs/${year}-${month}-${date}.txt`);
  if (!spFile.isFileExists(logPath)) {
    spFile.writeFile(logPath, content,'utf-8');
  }else{
    const logContent = spFile.readFile(logPath) + '\n------------------------------\n' + content;
    spFile.writeFile(logPath, logContent);
  }
}

module.exports = {
  writeLog,
  spFile
}