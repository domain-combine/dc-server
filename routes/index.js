const express = require('express');
const ctrl = require('./index.ctrl');

const router = express.Router();

router.get('/list', ctrl.getList);
router.get('/redirect', ctrl.redirect);

module.exports = router;
