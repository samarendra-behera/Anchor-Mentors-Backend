const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const mentor = sequelize.define('mentor', {
  userId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  bio: {
    type: DataTypes.STRING({length: 1000})
  },
  role: {
    type: DataTypes.STRING
  },
  profilePic: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  },
  laguages: {
    type: DataTypes.STRING
  },
  inspires: {
    type: DataTypes.STRING
  },
  experience: {
    type: DataTypes.FLOAT
  },
  rating: {
    type: DataTypes.FLOAT
  },
  linkedInUrl: {
    type: DataTypes.STRING
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE
  }
},
  {
    paranoid: true,
    freezeTableName: true,
    modelName: 'mentor',
  }
);

module.exports = mentor
