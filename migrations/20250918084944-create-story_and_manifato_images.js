'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("brand_story_and_manifato", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM("story","manifasto"),
          allowNull: true,
        },
     
        image: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        alt_text: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sequence: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      });
  },

  async down (queryInterface, Sequelize) {
        await queryInterface.dropTable("brand_story_and_manifato");
    
  }
};
