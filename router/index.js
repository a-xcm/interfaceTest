const express = require("express");
const router = express.Router();
const wiki = require('./wiki');
const user = require('./user');
const tool = require('./tool');

router.use('/wiki', wiki);
router.use('/user', user);
router.use('/tool', tool);



module.exports = router;
