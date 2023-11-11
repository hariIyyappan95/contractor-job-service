const httpStatus = require('http-status');
const { Op } = require('sequelize');
const {constants} = require('../../constants');

const getJobById = async(req) => {
  const {Job} = req.app.get('models');
  const res = await Job.findOne({
    where: { id: req.params.id}
  });
  return res;
}

const getUnpaidJobs = async(req) => {
    const { Job, Contract } = req.app.get('models');
    const profileId = req.profile.id;

    const unpaidJobs = await Job.findAll({
        where: {
            [Op.or]: [
              { paid: false },
              { paid: null },
            ],
        },
        include: [
            {
              attributes: [],
              model: Contract,
              required: true,
              where: {
                [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
                status: {
                  [Op.eq]: constants.statusInprogress,
                },
              },
            },
          ],
        });
    return unpaidJobs;
};


const payJob = async(req) => {
  const {Contract, Job, Profile} = req.app.get('models');
  const {id, balance, type} = req.profile;
  const jobId = req.params.id;
  const sequelize = req.app.get('sequelize');

  let response = '';
  const job = await Job.findOne({
    where : {
      id: jobId, 
      paid: null
    },
    include:[
      {
        model: Contract,
        where: {
          status: constants.statusInprogress, 
          ClientId: id
        },
      }
    ],
  });

  if(!job) return response = 'Unpaid jobs not found for this user';
  if(balance < job.price) return response = 'Insufficient funds';

  const client = req.profile;
  const contractor = await Profile.findOne({
    where: {
      id: job.Contract.ContractorId,
      type: constants.profileTypeContractor
    }
  });
  
  const paymentTransaction = await sequelize.transaction();

  try{
    await client.decrement({balance: job.price}, {transaction: paymentTransaction});
    await contractor.increment({ balance: job.price}, {transaction: paymentTransaction});
    await job.update({paid: true, paymentDate: Date.now()},{transaction: paymentTransaction});

    await paymentTransaction.commit();
    return job;
  } catch(error) {
    await transaction.rollback();
    throw error;
  }
};


module.exports = {
    getUnpaidJobs,
    payJob,
    getJobById
};