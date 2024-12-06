// wiki.js - 维基路由模块

const express = require("express");
const router = express.Router();

// 首页路由
router.get("/", (req, res) => {
    console.log("req",req.query);
  res.send("维基首页");
});

// “关于”页面路由
router.get("/about", (req, res) => {
  res.send("关于此维基");
});

module.exports = router;
