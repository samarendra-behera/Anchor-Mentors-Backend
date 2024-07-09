const sequelize = require('../../config/database');
const AppError = require('../../utils/appError');
const { DataTypes } = require('sequelize');


const mentorAvailability = sequelize.define('mentor_availability', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
    set(value) {
      const regex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
      if (regex.test(value)) {
        this.setDataValue('startTime', value);
      } else {
        throw new AppError(`Invalid start time ${value}`, 400);
      }
    }
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    set(value) {
      const regex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
      if (regex.test(value)) {
        this.setDataValue('endTime', value);
      } else {
        throw new AppError(`Invalid end time ${value}`, 400);
      }
    }
  },
  dayName: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    allowNull: false,
    set(value) {
      if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(value)) {
        throw new AppError('Invalid day name', 400);
      }
      this.setDataValue('dayName', value);
    }
  },
  mentorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'mentor',
      key: 'userId'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
},
  {
    freezeTableName: true,
    modelName: 'mentor_availability'
  });

module.exports = mentorAvailability