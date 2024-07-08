const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

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
    }
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  details: {
    type: DataTypes.STRING({ length: 1000 })
  },
  isPresentEmployement: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
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

module.exports = { mentorExperience }