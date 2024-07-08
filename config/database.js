const { Sequelize } = require('sequelize');

require('pg').types.setTypeParser(1114, stringValue => {
    return new Date(stringValue + '+05:30');
});

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

const sequelize = new Sequelize(config);

module.exports = sequelize