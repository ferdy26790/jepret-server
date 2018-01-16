const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')

/* GET users listing. */
router.post('/', userController.register)

module.exports = router;
