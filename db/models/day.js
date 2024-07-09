const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const day = sequelize.define('day', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    dayName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true,
    modelName: 'day'
});

module.exports = day