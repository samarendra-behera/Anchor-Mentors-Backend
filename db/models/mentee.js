const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const user = require('./user');
const AppError = require('../../utils/appError');

const mentee = sequelize.define('mentee', {
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
  joinInspires: {
    type: DataTypes.STRING({ length: 1000 }),
    set(value){
      if (!Array.isArray(value)) {
        throw new AppError('Join Inspires must be an array', 400);
      }
      value = value.join(',');
      if (!value) {
        throw new AppError('Join Inspires cannot be empty', 400);
      }
      this.setDataValue('joinInspires', value);
    },
    get() {
      let value = this.getDataValue('joinInspires');
      if (!value)  return [];
      return value.split(',');
    }
  },
  startupName: {
    type: DataTypes.STRING
  },
  currentStage: {
    type: DataTypes.STRING
  },
  fundingStage: {
    type: DataTypes.STRING
  },
  aboutStartup: {
    type: DataTypes.STRING({ length: 1000 })
  },
  painPointsOfStartup: {
    type: DataTypes.STRING({ length: 2000 })
  },
  websiteLink: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'Invalid Website URL'
      }
    }
  },
  appLink: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'Invalid App URL'
      }
    }
  },
  industry: {
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
});

mentee.belongsTo(user, {
  foreignKey: 'userId',
})

module.exports = mentee