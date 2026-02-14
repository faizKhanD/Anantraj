  'use strict';

  /** @type {import('sequelize-cli').Migration} */
  module.exports = {
    async up (queryInterface, Sequelize) {
      await queryInterface.createTable("township_sections", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue:'township'
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        sub_title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        other:{
          type: Sequelize.JSON,
          allowNull: true,
        },
        image: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      });
    },

    async down (queryInterface, Sequelize) {
      await queryInterface.dropTable("township_sections");
    }
  };
