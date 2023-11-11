const router = require('express').Router();
const{getBestProfession, getBestClients} = require('../controller/adminController');

router.get('/best-profession', getBestProfession);
router.get('/best-clients', getBestClients);
module.exports = router;