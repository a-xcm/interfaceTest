//读取文件
const fs = require('fs');
const path = require('path');
const spFile = require('./file')

//写入日志
function writeLog(content,req) {
  const nowDate = new Date();
  const year = nowDate.getFullYear();
  const month = nowDate.getMonth() + 1;
  const date = nowDate.getDate();
  let newContent = `\n-----------------------`
  +`\n操作时间：${formatDate('yyyy-MM-dd hh:mm:ss',nowDate)}`
  +`\n操作接口：${req.baseUrl + req.path}`
  +`\n请求方式：${req.method}`;
  
  if(req.method==='POST'){
    newContent += `\n请求体：${JSON.stringify(req.body)}`
  }else if(req.method==='GET'){
    newContent += `\n请求参数：${JSON.stringify(req.query)}`
  } else if(req.method==='DELETE'){
    newContent += `\n请求参数：${JSON.stringify(req.params)}`
  }
  newContent +=`\n错误内容：${content}`
  //判断文件是否存在
  const logPath = path.join(__dirname, `../logs/${year}-${month}-${date}.txt`);
  if (!spFile.isFileExists(logPath)) {
    newContent = formatDate('yyyy-MM-dd')+'\t接口日志文件' + newContent;
    spFile.writeFile(logPath, newContent,'utf-8');
  }else{
    const logContent = spFile.readFile(logPath);
    spFile.writeFile(logPath, logContent + newContent);
  }
}

//时间格式化
function formatDate(fmt,date) {
  if (!(date instanceof Date && !isNaN(date))) {
    date = new Date();
  }
  if (fmt == null || typeof fmt !== 'string') {
    fmt = 'yyyy-MM-dd hh:mm:ss';
  }
  // 实现日期格式化逻辑
  function padZero(num) {
    return (num < 10 ? '0' : '') + num;
  }

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  return fmt.replace('yyyy', year)
            .replace('MM', month)
            .replace('dd', day)
            .replace('hh', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
  
}


module.exports = {
  writeLog,
  spFile
}