//启动node服务
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const useRouter = require('./router');
const app = express();
app.use(cors())
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(fileUpload())
app.use(useRouter)
app.listen(port, () => {
  console.log("running on port: ")
  console.log('\x1b[32m%s\x1b[0m', 
  `http://localhost:${port}\nhttp://192.168.1.191:${port}`)
 
  console.log('接口测试服务启动成功！') 
});
