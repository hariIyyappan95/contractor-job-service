const router = require('express').Router();

const { getContractById, getUserNonTerminatedContracts } = require('../controller/contract.controller');
const { getProfile } = require('../middleware/getProfile');

router.get("/:id", getProfile, getContractById);
router.get("/", getProfile, getUserNonTerminatedContracts);

module.exports = router;