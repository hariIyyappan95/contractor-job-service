const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

const contactRoutes = require('./routes/contract.routes');
const jobRoutes = require('./routes/job.routes');
const profileRoutes = require('./routes/profile.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/contracts', contactRoutes);
app.use('/jobs', jobRoutes);
app.use('/balances', profileRoutes);
app.use('/admin', adminRoutes);

module.exports = app;
