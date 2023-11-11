const router = require('express').Router();

const {deposit, getProfileById} = require('../controller/profile.controller');

router.post('/deposit/:userId', deposit);
router.get('/:id', getProfileById);

module.exports = router;