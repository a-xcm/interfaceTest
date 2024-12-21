// 查询所有
const GET_ALL_FILE = `SELECT * FROM file`
// 插入文件sql
const INSERT_FILE = `INSERT INTO file (name) VALUES (?)`
// 删除文件sql
const DELETE_FILE = `DELETE FROM file WHERE id = ?`

// 通过id获取
const GET_FILE_BY_ID = `SELECT name FROM file WHERE id = ?`
// 通过名字获取id
const GET_FILE_BY_NAME = `SELECT id FROM file WHERE name = ?`


module.exports = {
  GET_ALL_FILE,
  INSERT_FILE,
  DELETE_FILE,
  GET_FILE_BY_ID,
  GET_FILE_BY_NAME
}