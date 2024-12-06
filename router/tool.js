const express = require("express");
const router = express.Router();
const path = require("path");
const { writeLog,spFile} = require("../utils");
const fileLogPath = path.join(__dirname, "../db/fileLog.json"); 
//查询文件列表
router.get("/fileList", (req, res) => {
  const fileLog = spFile.readFile(fileLogPath);
  const fileArr = JSON.parse(fileLog);
  res.send(fileArr);
});
// 上传文件
router.post("/upload", (req, res) => {
  const file = req.files.file;
  if (!file) {
    return res.status(400).send("请选择文件");
  }
  //只支持单个文件上传
  if (Array.isArray(file)) {
    return res.status(400).send("只支持单个文件上传");
  }
  //文件后缀
  const fileExt = file.name.split(".").pop();
  const time = new Date().getTime();
  const filename = time + "." + fileExt;
  const filePath = path.join(__dirname, "../uploads",filename);
  // fileLogPath如果不存在则创建文件
  if (!spFile.isFileExists(fileLogPath)) {
    spFile.writeFile(fileLogPath, "[]");
  }
  const fileLog = spFile.readFile(fileLogPath) ;
  const fileArr = JSON.parse(fileLog);
  file.mv(filePath, (err) => {
    if (err) {
      console.error(err);
      writeLog(`接口/tool/upload,文件上传失败,${filename},${filePath}`);
      return res.status(500).send("上传失败");
    }
    fileArr.push({
        filename,
    });
    spFile.writeFile(fileLogPath, JSON.stringify(fileArr));
    res.send({message:"上传成功",filename:filename});
  });
});
// 下载文件
router.get("/download", (req, res) => {
  const filename = req.query.filename;
  const filePath = path.join(__dirname, "../uploads", filename);
  if(!spFile.isFileExists(filePath)){
    writeLog(`接口/tool/download,文件不存在,${filename},${filePath}`);
    return res.status(404).send("文件不存在");
  }
  res.download(filePath);
});
// 删除文件
router.post("/delete", (req, res) => {
  const filename = req.body.filename;
  const filePath = path.join(__dirname, "../uploads", filename);
  const fileLog = spFile.readFile(fileLogPath);
  const fileArr = JSON.parse(fileLog);
  const index = fileArr.findIndex(item => item.filename === filename);
  if(spFile.isFileExists(filePath)){
    spFile.deleteFile(filePath);
    res.send("删除成功");
  } else {
    writeLog(`接口/tool/delete,文件不存在,${filename},${filePath}`);
    res.status(404).send("文件不存在");
  }
});
//预览文件
router.get("/preview", (req, res) => {
  const filename = req.query.filename;
  const filePath = path.join(__dirname, "../uploads", filename);
  if(!spFile.isFileExists(filePath)){
    writeLog(`接口/tool/preview,文件不存在,${filename},${filePath}`);
    return res.status(404).send("文件不存在");
  }
  res.sendFile(filePath);
});

module.exports = router;