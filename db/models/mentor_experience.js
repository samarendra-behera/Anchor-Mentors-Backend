const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const AppError = require('../../utils/appError');

const mentorExperience = sequelize.define('mentor_experience', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING
  },
  experienceType: {
    type: DataTypes.ENUM('Education', 'Work'),
    allowNull: false
  },
  placeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Start date is required'
      },
      notEmpty: {
        msg: 'Start date cannot be empty'
      }
    },
    set(value) {
      if (!value) {
        throw new AppError('Start date cannot be empty', 400);
      }
      value = new Date(value);
      if (isNaN(value)) {
        throw new AppError('Start date must be a valid date', 400);
      }
      this.setDataValue('startDate', value);
    }
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    set(value) {
      if (value) {
        value = new Date(value);
        if (isNaN(value)) {
          throw new AppError('End date must be a valid date', 400);
        }
      }
      this.setDataValue('endDate', value);
    }
  },
  details: {
    type: DataTypes.STRING({ length: 1000 })
  },
  isPresentEmployement: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    set(value){
      if (typeof value !== 'boolean') {
        throw new AppError('isPresentEmployement must be true or false', 400);
      }
      this.setDataValue('isPresentEmployement', value);
    }
  },
  mentorId: {
    type: DataTypes.INTEGER,
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
}, {
  freezeTableName: true,
  modelName: 'mentor_experience'
});

module.exports = mentorExperience 