var express = require('express');
var router = express.Router();

router.use('/api', require('./api'));
router.use(express.static('public'));

module.exports = router;
