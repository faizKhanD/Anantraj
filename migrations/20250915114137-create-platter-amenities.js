'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("platter_amenities", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      amenities_logo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "amenities_logos", key: "id" }, 
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      platter_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "platters", key: "id" }, 
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      banner: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      alt_text: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("platter_amenities");
  }
};
