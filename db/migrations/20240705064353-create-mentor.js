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
      profilePic:{
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      languages: {
        type: Sequelize.STRING
      },
      inspires: {
        type: Sequelize.STRING
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