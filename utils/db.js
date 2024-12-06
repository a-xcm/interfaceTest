const mysql = require('mysql2')
const { MYSQL_CONFIG } = require('../config')
//创建连接池
const pool = mysql.createPool(MYSQL_CONFIG)
 
//封装sql执行函数
const executeQuery = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
        return
      }
      connection.query(sql, values, (queryErr, results) => {
        connection.release()
        if (queryErr) {
          reject(queryErr)
        } else {
          resolve(results)
        }
      })
    })
  })
}
 
module.exports = {
  pool,
  executeQuery,
}