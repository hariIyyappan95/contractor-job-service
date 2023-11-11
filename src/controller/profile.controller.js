const httpStatus = require('http-status');

const profileService = require('../service/profile.service');

const deposit = async(req, res) => {
    try{
        if(req.body.amount == null) {
            return res.status(httpStatus.BAD_REQUEST).json({message: 'deposit amout not deinfed'});
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

module.exports = {
    deposit,
};