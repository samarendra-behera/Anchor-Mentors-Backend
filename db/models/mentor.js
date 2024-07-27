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
    type: DataTypes.STRING({ length: 1000 }),
    validate: {
      notEmpty: {
        msg: 'Bio cannot be empty'
      }
    }
  },
  role: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: 'Role cannot be empty'
      }
    }
  },
  startWorking: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: {
        msg: 'Start date must be a valid date'
      }
    }
  },
  isProfileComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    validate: {
      isBoolean: {
        msg: 'isProfileComplete must be true or false'
      }
    }
  },
  location: {
    type: DataTypes.STRING
  },
  languages: {
    type: DataTypes.JSON,
    set(value) {
      if (!Array.isArray(value)) {
        throw new AppError('Languages must be an array', 400);
      }
      if(value.length === 0) {
        throw new AppError('Languages cannot be empty', 400);
      }
      this.setDataValue('languages', value);
    },
    get() {
      let value = this.getDataValue('languages');
      if (!value) return [];
      return value;
    }
  },
  inspires: {
    type: DataTypes.JSON,
    set(value) {
      if (!Array.isArray(value)) {
        throw new AppError('Inspires must be an array', 400);
      }
      if (value.length === 0) {
        throw new AppError('Inspires cannot be empty', 400);
      }
      this.setDataValue('inspires', value);
    },
    get() {
      let value = this.getDataValue('inspires');
      if (!value) return [];
      return value;
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
    type: DataTypes.STRING({ length: 1000 }),
    validate: {
      notEmpty: {
        msg: 'Education Experience Description cannot be empty'
      }
    }
  },
  pastMentoringExperienceDescription: {
    type: DataTypes.STRING({ length: 1000 }),
    validate: {
      notEmpty: {
        msg: 'Past Mentoring Experience Description cannot be empty'
      }
    }
  },
  domainExpertise: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: 'Domain Expertise cannot be empty'
      }
    }
  },
  menteePersonaForBooking: {
    type: DataTypes.JSON,
    set(value) {
      if (!Array.isArray(value)) {
        throw new AppError('Mentee persona must be an array', 400);
      }
      if (value.length === 0) {
        throw new AppError('Mentee persona cannot be empty', 400);
      }
      this.setDataValue('menteePersonaForBooking', value);
    },
    get() {
      let value = this.getDataValue('menteePersonaForBooking');
      if (!value) return [];
      return value;
    }
  },
  needPitchDeck: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    validate: {
      isBoolean: {
        msg: 'needPitchDeck must be true or false'
      }
    }
  },
  sessionFrequency: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: 'Session Frequency cannot be empty'
      }
    }
  },
  goals: {
    type: DataTypes.JSON,
    set(value) {
      if (!Array.isArray(value)) {
        throw new AppError('Goals must be an array', 400);
      }
      if (value.length === 0) {
        throw new AppError('Goals cannot be empty', 400);
      }
      this.setDataValue('goals', value);
    },
    get() {
      let value = this.getDataValue('goals');
      if (!value) return [];
      return value;
    }
  },
  motivation: {
    type: DataTypes.STRING({ length: 1000 }),
    validate: {
      notEmpty: {
        msg: 'Motivation cannot be empty'
      }
    }
  },
  membershipBenefits: {
    type: DataTypes.STRING({ length: 1000 }),
    validate: {
      notEmpty: {
        msg: 'Membership Benefits cannot be empty'
      }
    }
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
