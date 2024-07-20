const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const mentorQuestion = sequelize.define('mentor_question', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Question is required'
      },
      notEmpty: {
        msg: 'Question cannot be empty'
      }
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
}, {
  freezeTableName: true,
  modelName: 'mentor_question'
});

module.exports = mentorQuestion