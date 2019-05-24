const express = require('express');
const ctrl = require('./index.ctrl');

const router = express.Router();

router.get('/list/:domain', ctrl.getList);
router.get('/detail/:tld', ctrl.getDetail);

module.exports = router;
