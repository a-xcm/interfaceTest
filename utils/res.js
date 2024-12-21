const message = {
    "success": "操作成功",
    "fail": "操作失败",
    "notFound": "未找到",
    "notExist": "不存在",
    "notLogin": "未登录",
    "notAuth": "未授权",
    "notAllow": "不允许操作",
    "notSupport": "不支持该操作",
    "notSupportMethod": "不支持该方法",
    "notSupportType": "不支持该类型",
    "error": "系统错误",
}
const stateCode = {
    "success": 200,
    "fail": 400,
    "notFound": 404,
    "notExist": 404,
    "notLogin": 401,
    "notAuth": 403,
    "notAllow": 403,
    "notSupport": 405,
    "notSupportMethod": 405,
    "notSupportType": 415,
    "error": 500,
}
const state = {
    "success": "success",
    "fail": "fail",
    "notFound": "notFound",
    "notExist": "notExist",
    "notLogin": "notLogin",
    "notAuth": "notAuth",
    "notAllow": "notAllow",
    "notSupport": "notSupport",
    "notSupportMethod": "notSupportMethod",
    "notSupportType":"notSupportType",
    "error": "error"
}

const resFun = (res,type,data,msg) => {
    res.status(stateCode[type]).send({
        "code":stateCode[type],
        "state":state[type],
        "message":msg||message[type],
        "data":data
    })
}
module.exports = {resFun}