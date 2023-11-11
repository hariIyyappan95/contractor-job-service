const router = require('express').Router();

const {deposit} = require('../controller/profile.controller');

router.post('/deposit/:userId', deposit);

module.exports = router;