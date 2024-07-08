'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mentor_experience', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      experienceType: {
        type: Sequelize.ENUM('Education', 'Work'),
        allowNull: false
      },
      placeName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATEONLY
      },
      details: {
        type: Sequelize.STRING({length: 1000})
      },
      isPresentEmployement: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      mentorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'mentor',
          key: 'userId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mentor_experience');
  }
};