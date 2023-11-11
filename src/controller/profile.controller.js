const httpStatus = require('http-status');

const profileService = require('../service/profile.service');

const deposit = async(req, res) => {
    try{
        if(req.body.amount == null) {
            return res.status(httpStatus.BAD_REQUEST).json({message: 'deposit amout not defined'});
        }
        
        const response = await profileService.deposit(req);

        if(typeof response === 'string' && response.includes('Maximum deposit amount reached')) {
            res.status(httpStatus.CONFLICT).json({message: `${response}`});
        } else if(typeof response === 'string' && response.includes('There are no unpiad jobs for client')) {
            res.status(httpStatus.NOT_FOUND).json({message: `${response}`});
        } else{
            res.status(httpStatus.OK).json(response);
        }
    } catch(error){
        console.trace(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured while depositing money'});
    }
};

//only for internal testing the account balance
const getProfileById = async(req, res) => {
    try{
        const result = await profileService.getProfileById(req);
        res.status(httpStatus.OK).json(result);
    } catch(error) {
        console.trace(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error in getting profile details'});
    }
}

module.exports = {
    deposit,
    getProfileById,
};