// 本地测试 saas1接口
const axios = require('axios'); 
const express = require("express");
const router = express.Router();
// http://system.es-it.cn/WebSolution/GetClientUrl.aspx?key='+key
router.get("/GetClientUrl", async (req, res) => {
    try {
        const key = req.query.key;
        const result = await axios.get('http://system.es-it.cn/WebSolution/GetClientUrl.aspx?key='+key);
        // 判断字符串还是对象
        console.log(result.data);
        res.send(result.data);
    }catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// https://saas1.es-iot.cn/api/charge/wx/saveReceiptBill
router.post("/saveReceiptBill", async (req, res) => {
    try {
        const result = await axios.post('http://saas1.es-iot.cn/api/charge/wx/saveReceiptBill', req.body);
        // 返回blod
        res.send(result.data);
    }catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/getUrl", async (req, res) => {
    try {
        const result = await axios.post('http://saas1.es-iot.cn/api/charge/wx/getUrl', req.body,{responseType: 'text/html'});
        // 返回header Content-Type = text/html
        res.setHeader('Content-Type', 'text/html');
        res.send(result.data);
    }catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;