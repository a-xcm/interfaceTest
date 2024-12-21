
const { executeQuery } = require('../utils/db')
const express = require("express");
const router = express.Router();
const { resFun } = require('../utils/res');
const { 
    SELECT_BY_ID,
    SELECT_BY_USERNAME,
    INSERT_USER,
    UPDATE_BY_ID,
    SELECT_ALL,
    SELECT_LIMIT,
    SELECT_COUNT
 } = require('../sql/user');
const { writeLog } = require('../utils');

/**
 * 通过id查询用户信息
 */ 
router.get("/getById", async (req, res) => {
const id = req.query.id;
    try {
        const result = await executeQuery(SELECT_BY_ID,[id]);
        if (result.length > 0) {
            resFun(res,"success",result[0])
        } else {
            writeLog('用户不存在',req);
            resFun(res,"fail",null,'用户不存在')
        }
    } catch (error) {
        writeLog(error,req);
        resFun(res,'error',null)
    }
})
/**
 * 查询所有用户信息
 */
router.get("/list", async (req, res) => {
   try {
    const result = await executeQuery(SELECT_ALL);
    resFun(res,'success',result)
   } catch (error) {
    writeLog(error,req);
    resFun(res,'error',null)
   }
    
});
/**
 * 注册用户
 */
router.post("/register",async (req, res) => {
    const user = req.body;
    if(!user)return resFun(res,'fail',null,'请求参数错误')
    if(user&&!user.username)return resFun(res,'fail',null,'用户名不能为空')
    //user.age可能不存在
    if(user&&!user.age)user.age = null;
    try {
        const result =await executeQuery(SELECT_BY_USERNAME,[user.username]);
        if (result.length > 0) {
            writeLog('用户名已存在',req);
            resFun(res,'fail',null,'用户名已存在')
        } else {
           const result1 = await executeQuery(INSERT_USER,[user.username,user.age]);
            if(result1.affectedRows == 0){
                writeLog('注册失败',req);
                return resFun(res,'fail',null,'注册失败')
            }
            writeLog('注册成功',req);
            const zuot = await executeQuery(SELECT_BY_USERNAME,[user.username]);
            resFun(res,'success',zuot[0])
        }
    } catch (error) {
        writeLog(error,req);
        resFun(res,'error',null)

    }
});

/**
 * 更新用户信息
 */
router.post("/update", async (req, res) => {
    const user = req.body;
    if(!user)return resFun(res,'fail',null,'请求参数错误')
    if(user&&!user.id)return resFun(res,'fail',null,'id 不能为空')
    // username不能为空字符串
    if(user&&! this.toString(user.username).trim())return resFun(res,'fail',null,'用户名不能为空')
    try {
        // 判断用户是否存在
        const res1 = await executeQuery(SELECT_BY_USERNAME,[user.username]);
        if (res1.length > 0) {
            if(res1[0].id != user.id){
                writeLog('用户名已存在',req);
                return resFun(res,'fail',null,'用户名已存在')
            }
        }
        let zuot = await executeQuery(SELECT_BY_ID,[user.id]);
        if (zuot.length == 0) {
            writeLog('用户不存在',req);
            return resFun(res,'fail',null,'用户不存在')
        }
        if(user&&!user.age)user.age = zuot[0].age;
        const result = await executeQuery(UPDATE_BY_ID,[user.username,user.age,user.id]);
        if (result.affectedRows > 0) {
            zuot = await executeQuery(SELECT_BY_ID,[user.id]);
            resFun(res,'success',zuot[0])
        } else {
            writeLog('用户不存在',req);
            resFun(res,'fail',null,'用户不存在')
        }
    } catch (error) {
        writeLog(error,req);
        resFun(res,'error',null)
    }
});
/**
 * 分页查询用户信息
 */
router.get("/page", async (req, res) => {
    if(!req.query.page){
        req.query.page = 1;
    }
    if(!req.query.size){
        req.query.size = 10;
    }
    const page = parseInt(req.query.page) ;
    const size = parseInt(req.query.size) ;
    const valuse = [(page-1)*size,size];
    try {
        const count = await executeQuery(SELECT_COUNT);
        const result = await executeQuery(SELECT_LIMIT,valuse);
        const data = {
            "page":page,
            "size":size,
            "totalPage":Math.ceil(count[0].count/size),
            "total":count[0].count,
            "list":result
        }
        resFun(res,'success',data)
    } catch (error) {
        writeLog(error,req);
        resFun(res,'error',null)

    }
})


module.exports = router;
