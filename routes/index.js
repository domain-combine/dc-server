const express = require('express');
const ctrl = require('./index.ctrl');

const router = express.Router();

router.get('/list', ctrl.getList);
router.get('/detail', ctrl.getDetail);

module.exports = router;
