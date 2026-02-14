'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
       await queryInterface.createTable('construction_update_sub_projects', {
         id: {
           type: Sequelize.INTEGER,
           primaryKey: true,
           autoIncrement: true,
         },
         construction_project_id: {
           type: Sequelize.INTEGER,
           allowNull: false,
           references: { model: 'construction_projects', key: 'id' },
         },
         title: {
           type: Sequelize.STRING,
           allowNull: false,
         },
         file: {
           type: Sequelize.STRING,
           allowNull: true,
         },
         status: {
           type: Sequelize.INTEGER,
           allowNull: false,
           defaultValue: 1,
         },
       });
  },

  async down (queryInterface, Sequelize) {
       await queryInterface.dropTable('construction_update_sub_projects');

  }
};
