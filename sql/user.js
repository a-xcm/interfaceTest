// 通过id查询用户
const SELECT_BY_ID = `SELECT * FROM user WHERE id = ?`
// 通过用户名查询用户
const SELECT_BY_USERNAME = `SELECT * FROM user WHERE username = ?`
// 用户名 模糊搜索
const SELECT_BY_USERNAME_LIKE = `SELECT * FROM user WHERE username LIKE ?`

//查询全部
const SELECT_ALL = `SELECT * FROM user `
//分页
const SELECT_LIMIT = `SELECT * FROM user limit ?,?`
//新增
const INSERT_USER = `INSERT INTO user (username, age) VALUES (?, ?)`
//更新
const UPDATE_BY_ID = `UPDATE user SET username = ?, age = ? WHERE id = ?`
//删除
const DELETE_BY_ID = `DELETE FROM user WHERE id = ?`


module.exports = {
    SELECT_BY_ID,
    SELECT_BY_USERNAME,
    SELECT_BY_USERNAME_LIKE,
    SELECT_ALL,
    SELECT_LIMIT,
    INSERT_USER,
    UPDATE_BY_ID,
    DELETE_BY_ID
}