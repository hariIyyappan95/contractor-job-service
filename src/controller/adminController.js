const httpStatus = require('http-status');

const adminService = require('../service/adminService');

const getBestProfession = async(req, res) => {
    try{
        const result = await adminService.getBestProfession(req);

        if(!result) {
            res.status(httpStatus.NOT_FOUND).json({message: 'No best profession found'});
        } else if(typeof result === 'string' && result.includes('Invalid date format')){
            res.status(httpStatus.BAD_REQUEST).json({message: 'Invalid date format'});
        } else {
            res.status(httpStatus.OK).json(result);
        }
    } catch(error) {
        console.trace(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured while finding best profession', error: error.message})
    }
};

const getBestClients = async(req, res) => {
    try{
        const result = await adminService.getBestClients(req);
        if(!result) {
            res.status(httpStatus.NOT_FOUND).json({message: 'No best clients found'});
        } else if(typeof result === 'string' && result.includes('Invalid date format')){
            res.status(httpStatus.BAD_REQUEST).json({message: 'Invalid date format'});
        } else if(typeof result === 'string' && result.includes('Limit must be a number')){
            res.status(httpStatus.BAD_REQUEST).json({message: 'Limit must be a number'})
        } else {
            res.status(httpStatus.OK).json(result);
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