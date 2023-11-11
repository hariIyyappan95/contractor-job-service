const {Op} = require('sequelize');
const { Contract } = require('../model');
const { constants } = require('../../constants');

const getContractById = async(req) => {
    const {Contract} = req.app.get('models');
    const profileId = req.profile.id;
    const contract = await Contract.findOne({
        where: {
            id: req.params.id,
            [Op.or] :[{ContractorId: profileId},{ClientId: profileId}],
        },
    });
    return contract;
}

const getUserNonTerminatedContracts = async(req) => {
    const {Contract} = req.app.get('models');
    const profileId = req.profile.id;
    const contracts = await Contract.findAll({
        where:{
            [Op.or]:[{ContractorId: profileId}, {ClientId: profileId}],
            status:{
                [Op.ne]: constants.statusTerminated,
            },
        },
    });
    return contracts;
}

module.exports = { getContractById, getUserNonTerminatedContracts };