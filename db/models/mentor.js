const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const user = require('./user');
const AppError = require('../../utils/appError');

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
    type: DataTypes.STRING({ length: 1000 })
  },
  role: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  },
  languages: {
    type: DataTypes.STRING,
    set(value) {
      if (!Array.isArray(value)) {
        throw new AppError('Languages must be an array', 400);
      }
      value = value.join(',');
      if (!value) {
        throw new AppError('Languages cannot be empty', 400);
      }
      this.setDataValue('languages', value);
    },
    get() {
      let value = this.getDataValue('languages');
      if (!value)  return [];
      return value.split(',');
    }
  },
  inspires: {
    type: DataTypes.STRING({ length: 1000 }),
    set(value) {
      if (!Array.isArray(value)) {
        throw new AppError('Inspires must be an array', 400);
      }
      value = value.join(',');
      if (!value) {
        throw new AppError('Inspires cannot be empty', 400);
      }
      this.setDataValue('inspires', value);
    },
    get() {
      let value = this.getDataValue('inspires');
      if (!value)  return [];
      return value.split(',');
    }
  },
  experience: {
    type: DataTypes.FLOAT,
    validate: {
      min: 0,
      isFloat: {
        msg: 'Experience must be a number'
      }
    }
  },
  rating: {
    type: DataTypes.FLOAT,
    validate: {
      min: 0,
      max: 5,
      isFloat: {
        msg: 'Rating must be a number'
      }
    }
  },
  linkedInUrl: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'Invalid LinkedIn URL'
      }
    }
  },
  educationExperienceDescription: {
    type: DataTypes.STRING({ length: 1000 })
  },
  pastMentoringExperienceDescription: {
    type: DataTypes.STRING({ length: 1000 })
  },
  domainExpertise: {
    type: DataTypes.STRING
  },
  menteePersonaForBooking: {
    type: DataTypes.STRING({ length: 1000 }),
    set(value) {
      if (!Array.isArray(value)) {
        throw new AppError('Mentee persona must be an array', 400);
      }
      value = value.join(',');
      if (!value) {
        throw new AppError('Mentee persona cannot be empty', 400);
      }
      this.setDataValue('menteePersonaForBooking', value);
    },
    get() {
      let value = this.getDataValue('menteePersonaForBooking')
      if (!value) return [];
      return value.split(',');
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
  }
);

mentor.belongsTo(user, {
  foreignKey: 'userId',
})

module.exports = mentor
