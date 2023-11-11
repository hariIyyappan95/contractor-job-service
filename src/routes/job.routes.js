const router = require('express').Router();

const { getUnpaidJobs,payJob,getJobById } = require('../controller/job.controller');
const { getProfile } = require('../middleware/getProfile');

router.get('/unpaid', getProfile, getUnpaidJobs);
router.post('/:id/pay', getProfile, payJob);
router.get('/:id', getJobById);

module.exports = router;