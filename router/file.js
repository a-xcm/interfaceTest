const express = require("express");
const router = express.Router();
const path = require("path");
const { resFun } = require("../utils/res");
const { writeLog,spFile} = require("../utils");
const { executeQuery } = require('../utils/db')
const {
  GET_ALL_FILE,  
  INSERT_FILE,
  DELETE_FILE,
  GET_FILE_BY_ID,
  GET_FILE_BY_NAME 
} = require("../sql/file");
/**
 * 文件管理
 */
router.get("/list_manage", async (req, res) => {
  try {
    const result = await executeQuery(GET_ALL_FILE);
    resFun(res,"success",result)
  } catch (error) {
    writeLog(error,req);
    resFun(res,"error",null)
  }
});
/**
 * 上传单个文件
 */
router.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return resFun(res,"fail",null,'请选择上传文件')
  }
  const file = req.files.file;
  //只支持单个文件上传
  if (Array.isArray(file)) {
    return resFun(res,"fail",null,'只支持单个文件上传')
  }
  try {
   //文件后缀
  const fileExt = file.name.split(".").pop();
  const time = new Date().getTime()+ Math.floor(Math.random() * 10000000);
  const filename = time + "." + fileExt;
  const filePath = path.join(__dirname, "../uploads",filename);
  file.mv(filePath, async (err) => {
    if (err) {
      writeLog(err,req);
      return resFun(res,"fail",null)
    }
    const result1 = await executeQuery(INSERT_FILE,[filename]);
    if(result1.affectedRows == 0){
      writeLog(`上传失败`,req);
      //删除文件
      spFile.deleteFile(filePath);
      return resFun(res,"fail",null)
    }

    const result2 = await executeQuery(GET_FILE_BY_NAME,[filename]);
    resFun(res,"success",{
      name:filename,id:result2[0].id
    }) 
  });
  } catch (error) {
    writeLog(error,req);
    return resFun(res,"error",null)
  }
  
});
/**
 * 上传多个文件
 */
router.post("/uploads", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return resFun(res,"fail",null,'请选择上传文件')
  }
  try {
    const files = req.files.files;
    const fileList = [];
    const promiseList = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      //文件后缀
      const fileExt = file.name.split(".").pop();
      const time = new Date().getTime()+ Math.floor(Math.random() * 10000000);
      const filename = time + "." + fileExt;
      const filePath = path.join(__dirname, "../uploads",filename);
      const promise = new Promise((resolve, reject) => {
        file.mv(filePath, (err) => {
          if (err) {
            writeLog(err,req);
            return reject(err)
          }
          resolve(filename)
        });
      })
      promiseList.push(promise)
    }
   
   const pro = await Promise.all(promiseList);
   console.log("prolist",pro)
   fileList.push(...pro);
    const sqlInsert = 'INSERT INTO file (name) VALUES '+fileList.map(item=>`('${item}')`).join(',');
    const result = await executeQuery(sqlInsert);
    
    if(result.affectedRows == 0){
      writeLog(`上传失败`,req);
      return resFun(res,"fail",null)
    }
    //查询文件
    const sqlSearch = 'SELECT * FROM file WHERE name IN ('+fileList.map(item=>'"'+item+'"').join(',')+')';
    const zuot = await executeQuery(sqlSearch);
    resFun(res,"success",zuot)

  }catch (error) {
    writeLog(error,req);
    return resFun(res,"error",null)
  }
});
/**
 * 下载文件
 */
router.get("/download", async (req, res) => {
  try {
    const fileId = req.query.fileId;
    const result = await executeQuery(GET_FILE_BY_ID,[fileId]);
    const filename = result[0].name;
    const filePath = path.join(__dirname, "../uploads", filename);
    if(!spFile.isFileExists(filePath)){
      writeLog('文件不存在',req);
      return resFun(res,"fail",null,'文件不存在')
    }
    res.download(filePath);
  } catch (error) {
    writeLog(error,req);
    return resFun(res,"error",null)
  }
 
});
/**
 * 删除文件
 */
router.post("/delete",async (req, res) => {
  try {
    const fileId = req.body.fileId;
    const result = await executeQuery(GET_FILE_BY_ID,[fileId]);
    console.log("length",result.length);
    if(result.length == 0){
      writeLog(`数据不存在`,req);
      return resFun(res,"fail",null,'数据不存在')
    }
    const filename = result[0].name;
    const filePath = path.join(__dirname, "../uploads", filename);
    if(spFile.isFileExists(filePath)){
      spFile.deleteFile(filePath);
      const result1 = await executeQuery(DELETE_FILE,[fileId]);
      if(result1.affectedRows == 0){
        writeLog(`数据不存在`,req);
        return resFun(res,"fail",null,'数据不存在')
      }
      resFun(res,"success",null)
    } else {
      writeLog(`文件不存在`,req);
      return resFun(res,"fail",null,'文件不存在')
    }
  } catch (error) {
    writeLog(error,req);
    return resFun(res,"error",null)
  }
 
});
/**
 * 预览文件
 */
router.get("/preview",async (req, res) => {
  try {
    const fileId = req.query.fileId;
    const result = await executeQuery(GET_FILE_BY_ID,[fileId]);
    if(result.length == 0){
      writeLog(`数据不存在`,req);
      return resFun(res,"fail",null,'数据不存在')
    }
    const filename = result[0].name;
    const filePath = path.join(__dirname, "../uploads", filename);
    if(!spFile.isFileExists(filePath)){
      writeLog('文件不存在',req);
      return resFun(res,"fail",null,'文件不存在')
    }
    res.sendFile(filePath);
  } catch (error) {
    writeLog(error,req);
    return resFun(res,"error",null)
  }
 
});

module.exports = router;