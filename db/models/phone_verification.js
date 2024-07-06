const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const phoneVerification = sequelize.define('phone_verification', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Phone number cannot be empty'
      },
      notNull: {
        msg: 'Phone number is required'
      }
    }
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
    modelName: 'phone_verification'
  }
);

module.exports = phoneVerification