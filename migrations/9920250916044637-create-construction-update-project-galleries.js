"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("construction_update_project_galleries", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      construction_update_project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "construction_projects", // table name of ConstructionProject
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      construction_update_sub_project_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // ✅ nullable field
        references: {
          model: "construction_update_sub_projects", // same reference table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // recommended for nullable FK
      },

      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      video_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      alt: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      modified_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("construction_update_project_galleries");
  },
};
