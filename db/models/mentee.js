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
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: 'Startup Name cannot be empty'
      }
    }
  },
  currentStage: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: 'Current Stage cannot be empty'
      }
    }
  },
  fundingStage: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: 'Funding Stage cannot be empty'
      }
    }
  },
  aboutStartup: {
    type: DataTypes.STRING({ length: 1000 }),
    validate: {
      notEmpty: {
        msg: 'About Startup cannot be empty'
      }
    }
  },
  painPointsOfStartup: {
    type: DataTypes.STRING({ length: 2000 }),
    validate: {
      notEmpty: {
        msg: 'Pain Points of Startup cannot be empty'
      }
    }
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
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: 'Industry cannot be empty'
      }
    }
  },
  pitchDeckPath: {
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