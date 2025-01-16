const express = require("express");
const router = express.Router();
const wiki = require('./wiki');
const user = require('./user');
const file = require('./file');
const easysoft = require('./easysoft');
const { resFun } = require('../utils/res');
router.use('/wiki', wiki);
router.use('/user', user);
router.use('/file', file);
router.use('/easysoft', easysoft);

router.get("*", (req, res) => {
    resFun(res,'notFound',null)
});

module.exports = router;
