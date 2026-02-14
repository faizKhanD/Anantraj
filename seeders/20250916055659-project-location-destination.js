'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("project_location_destination", [
      { name: "hotel", status: 1,  created_at: new Date(), updated_at: new Date() },
      { name: "hospital", status: 1,  created_at: new Date(), updated_at: new Date() },
      { name: "school", status: 1,  created_at: new Date(), updated_at: new Date() },
      { name: "metro", status: 1,  created_at: new Date(), updated_at: new Date() },
      { name: "mall", status: 1,  created_at: new Date(), updated_at: new Date() },
      { name: "airport", status: 1,  created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("project_location_destination", {}, {});
  }
};
