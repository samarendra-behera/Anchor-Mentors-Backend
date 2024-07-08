const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const user = require('./user');

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
  location: {
    type: DataTypes.STRING
  },
  languages: {
    type: DataTypes.STRING
  },
  inspires: {
    type: DataTypes.STRING
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
    type: DataTypes.STRING({length: 1000})
  },
  pastMentoringExperienceDescription: {
    type: DataTypes.STRING({length: 1000})
  },
  domainExpertise: {
    type: DataTypes.STRING
  },
  menteePersonaForBooking: {
    type: DataTypes.STRING
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
