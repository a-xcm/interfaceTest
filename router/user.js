
const { pool, executeQuery } = require('../utils/db')
const express = require("express");
const router = express.Router();
const { 
    SELECT_BY_ID,
    SELECT_BY_USERNAME,
    INSERT_USER,
    UPDATE_BY_ID,
    SELECT_ALL,
    SELECT_LIMIT
 } = require('../sql/user');
router.get("/getById", async (req, res) => {
const id = req.query.id;
const sql = SELECT_BY_ID
const valuse = [id]
    try {
        const result = await executeQuery(sql,valuse);
        if (result.length > 0) {
            res.send(result[0]);
        } else {
            res.status(404).send({"message": "用户不存在"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({"message": "服务器内部错误"});
    }
})
router.get("/list", async (req, res) => {
   try {
    const result = await executeQuery(SELECT_ALL);
    res.send(result);
   } catch (error) {
    console.log(error);
    res.status(500).send({"message": "服务器内部错误"});
   }
    
});
router.post("/register",async (req, res) => {
    const user = req.body;
    if(!user)res.status(400).send({"message": "请求参数错误"});
    if(user&&!user.username)res.status(400).send({"message": "用户名不能为空"});
    //user.age可能不存在
    if(user&&!user.age)user.age = 0;
    try {
        const result1 = executeQuery(SELECT_BY_USERNAME,[user.username]);
        if (result1.length > 0) {
            res.status(400).send({ "message": "用户已存在" });
        } else {
            await executeQuery(INSERT_USER,[user.username,user.age]);
            zuot = await executeQuery(SELECT_BY_USERNAME,[user.username]);
            res.send({ "message": "注册成功",'user':zuot[0] });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({"message": "服务器内部错误"});
    }
});
router.post("/update", async (req, res) => {
    const user = req.body;
    if(!user)res.status(400).send({"message": "请求参数错误"});
    if(user&&!user.id)res.status(400).send({"message": "id不能为空"});
    try {
        const result = await executeQuery(UPDATE_BY_ID,[user.username,user.age,user.id]);
        if (result.affectedRows > 0) {
            const zuot = await executeQuery(SELECT_BY_ID,[user.id]);
            res.send({ "message": "更新成功","data":zuot[0] });
        } else {
            res.status(404).send({ "message": "用户不存在" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({"message": "服务器内部错误"});
    }
});
//分页查询
router.get("/page", async (req, res) => {
    if(!req.query.page){
        req.query.page = 1;
    }
    if(!req.query.size){
        req.query.size = 10;
    }
    const page = parseInt(req.query.page) ;
    const size = parseInt(req.query.size) ;
    const sql = SELECT_LIMIT;
    const valuse = [(page-1)*size,size];
    try {
        const result = await executeQuery(sql,valuse);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({"message": "服务器内部错误"});
    }
})

module.exports = router;
