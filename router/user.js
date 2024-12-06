
const { pool, executeQuery } = require('../utils/db')
const express = require("express");
const router = express.Router();
router.get("/getById", async (req, res) => {
const id = req.query.id;
const sql = `SELECT * FROM user WHERE id = ${id};`
    try {
        const result = await executeQuery(sql);
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
    const sql = `SELECT * FROM user;`
    const result = await executeQuery(sql);
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
    const insql = `INSERT INTO user (username, age) VALUES ('${user.username}', '${user.age}')`;
    const qsql = `SELECT * FROM user WHERE username = '${user.username}'`;
    try {
        const result1 = executeQuery(qsql);
        if (result1.length > 0) {
            res.status(400).send({ "message": "用户已存在" });
        } else {
            await executeQuery(insql);
            zuot = await executeQuery(qsql);
            res.send({ "message": "注册成功",'user':zuot[0] });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({"message": "服务器内部错误"});
    }
});
router.put("/update", async (req, res) => {
    const user = req.body;
    if(!user)res.status(400).send({"message": "请求参数错误"});
    if(user&&!user.id)res.status(400).send({"message": "id不能为空"});
    const sql = `UPDATE user SET username = '${user.username}', age = '${user.age}' WHERE id = '${user.id}'`;
    try {
        const result = await executeQuery(sql);
        if (result.affectedRows > 0) {
            res.send({ "message": "更新成功" });
        } else {
            res.status(404).send({ "message": "用户不存在" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({"message": "服务器内部错误"});
    }
});

module.exports = router;
