'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mentor', {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      bio: {
        type: Sequelize.STRING({length: 1000})
      },
      role: {
        type: Sequelize.STRING
      },
      startWorking: {
        type: Sequelize.DATEONLY,
      },
      isProfileComplete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING
      },
      languages: {
        type: Sequelize.JSON
      },
      inspires: {
        type: Sequelize.JSON
      },
      experience: {
        type: Sequelize.FLOAT
      },
      rating: {
        type: Sequelize.FLOAT
      },
      linkedInUrl: {
        type: Sequelize.STRING
      },
      educationExperienceDescription: {
        type: Sequelize.STRING({length: 1000})
      },
      pastMentoringExperienceDescription: {
        type: Sequelize.STRING({length: 1000})
      },
      domainExpertise: {
        type: Sequelize.STRING
      },
      menteePersonaForBooking: {
        type: Sequelize.JSON
      },
      needPitchDeck: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      sessionFrequency: {
        type: Sequelize.STRING
      },
      goals: {
        type: Sequelize.JSON
      },
      motivation: {
        type: Sequelize.STRING({length: 1000})
      },
      membershipBenefits: {
        type: Sequelize.STRING({length: 1000})
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mentor');
  }
};