'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      resource: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.GEOMETRY('POINT', 4326)
      },
      category: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      rating: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      notes: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      photoTakenAt:{
        allowNull: true,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('events');
  }
};
