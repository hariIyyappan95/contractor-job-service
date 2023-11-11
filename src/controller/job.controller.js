const httpStatus = require('http-status');
const jobService = require('../service/job.service');

const getUnpaidJobs = async(req, res) => {
    try{
        const unpaidJobs = await jobService.getUnpaidJobs(req);
        if(!unpaidJobs) {
            res.sendStatus(httpStatus.NOT_FOUND);
        } else {
            res.status(httpStatus.OK).json(unpaidJobs);
        }
    } catch(error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error});
    }
};

const payJob = async(req, res) => {
    try{
        const response = await jobService.payJob(req);
        if(typeof response === 'string' && response.includes('Unpaid jobs not found for this user')) {
            res.status(httpStatus.NOT_FOUND).json({message: 'Unpaid jobs not found for this user'});
        } else if(typeof response === 'string' && response.includes('Insufficient funds')) {
            res.status(httpStatus.BAD_REQUEST).json({message: 'Insufficent funds'});
        } else {
            res.status(httpStatus.OK).json(response);
        }
    } catch(error) {
        console.trace(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Error occurred while paying for a jobid ${req.params.id}`, error});
    }
};

 const getJobById = async(req,res) => {
     try{
        const response = await jobService.getJobById(req);
        res.status(200).json(response);
     } catch(error) {
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error while fetching job details'});
     }
     
 }


module.exports = {
    getUnpaidJobs,
    payJob,
    getJobById,
};
