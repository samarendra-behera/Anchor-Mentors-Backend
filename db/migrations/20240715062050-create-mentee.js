'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mentee', {
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
      joinInspires: {
        type: Sequelize.STRING({length: 1000})
      },
      startupName: {
        type: Sequelize.STRING
      },
      currentStage: {
        type: Sequelize.STRING
      },
      fundingStage: {
        type: Sequelize.STRING
      },
      aboutStartup: {
        type: Sequelize.STRING({length: 1000})
      },
      painPointsOfStartup: {
        type: Sequelize.STRING({length: 2000})
      },
      websiteLink: {
        type: Sequelize.STRING
      },
      appLink: {
        type: Sequelize.STRING
      },
      industry: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('mentee');
  }
};