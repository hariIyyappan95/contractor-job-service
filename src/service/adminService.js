const { constants } = require('../../constants');

const getBestProfession = async(req) => {
    const {Job, Contract, Profile} = req.app.get('models');
    const {Op} = require('sequelize');
    const {start, end} = req.query;

    const {startDate, endDate} = await getStartAndEndDate(start, end);

    if(startDate == 'Invalid Date' || endDate == 'Invalid Date') return 'Invalid date format';

    const paidJobsForPeriod = await Job.findAll({
        where: {
            paid: true,
            paymentDate: {
                [Op.between]: [startDate, endDate]
            }
        },
        include: [
            {
                model: Contract,
                include: [
                    {
                        model: Profile,
                        as: 'Contractor',
                        where: {type: constants.profileTypeContractor}
                    }
                ]
            }
        ]
    });

    if(paidJobsForPeriod.length == 0) return 'No paid jobs performed in that period of time';

    const earnedMoneyPerProfession = paidJobsForPeriod.reduce((result, job) => {
        const profession = job.Contract.Contractor.profession;
        if(typeof result[profession] == 'undefined') {
            result[profession] = job.price;
        } else {
            result[profession] += job.price;
        }
        return result;
    },{});

    const bestProfessionWihtMoney = Object.entries(earnedMoneyPerProfession).reduce((a,b) => a[1]>b[1] ? a : b);
    
    return bestProfessionWihtMoney[0];
};
const getStartAndEndDate = async(start, end) => {
    startDate = new Date(start);
    startDate.setUTCHours(0,0,0,0);
    endDate = new Date(end);
    endDate.setUTCHours(23,59,59,999);
    return {startDate, endDate};
}

const getBestClients = async(req, res) => {
    const sequelize = req.app.get('sequelize');
    const {Op} = require('sequelize');
    const {Job, Contract, Profile} = req.app.get('models');
    const {start, end, limit} = req.query;

    const {startDate, endDate} = await getStartAndEndDate(start, end);
    
    const countLimit = parseInt(limit ? limit : 2);

    if(startDate == 'Invalid Date' || endDate == 'Invalid Date') return 'Invalid date format';
    if(isNaN(countLimit)) return 'Limit must be a number';

    const paidJobsForPeriod = await Job.findAll({
        attributes: [[sequelize.fn('sum', sequelize.col('price')), 'totalPaid']],
        order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
        where: {
            paid: true,
            paymentDate: {
                [Op.between]: [startDate, endDate]
            }
        },
        include: [
            {
                model: Contract,
                include: [
                    {
                        model: Profile,
                        as: 'Client',
                        where: {type: constants.profileTypeClient},
                        attributes: ['firstName', 'lastName']
                    }
                ],
                attributes: ['ClientId']
            }
        ],
        group: 'Contract.ClientId',
        limit: countLimit
    });

    const paidPerClient = paidJobsForPeriod.map(function (x) {
        return {
            id: x.Contract.ClientId,
            fullName: x.Contract.Client.firstName + ' ' + x.Contract.Client.lastName,
            paid: x.dataValues.totalPaid
        };
    });

    return paidPerClient;  
};

module.exports = {
    getBestProfession,
    getBestClients,
};