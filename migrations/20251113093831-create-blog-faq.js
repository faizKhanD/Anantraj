'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("blog_faqs", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      blog_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "blogs", key: "id" }, // FK constraint
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      question: {
        type: Sequelize.TEXT,  // ✅ fixed
        allowNull: false,
      },
      answer: {
        type: Sequelize.TEXT,  // ✅ fixed
        allowNull: false,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("blog_faqs");
  }
};
