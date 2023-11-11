const httpStatus = require('http-status');

const adminService = require('../service/adminService');

const getBestProfession = async(req, res) => {
    try{
        const bestProfession = await adminService.getBestProfession(req);

        if(!bestProfession) {
            res.status(httpStatus.NOT_FOUND).json({message: 'No best profession found'});
        } else {
            res.status(httpStatus.OK).json(bestProfession);
        }
    } catch(error) {
        console.trace(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured while finding best profession', error: error.message})
    }
};

const getBestClients = async(req, res) => {
    try{
        const bestClients = await adminService.getBestClients(req);
        if(!bestClients) {
            res.status(httpStatus.NOT_FOUND).json({message: 'No best clients found'});
        } else {
            res.status(httpStatus.OK).json(bestClients);
        }
    } catch(error){
        console.trace(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured while finding best clients', error: error.message})
    }
};

module.exports = {
    getBestProfession,
    getBestClients,
};