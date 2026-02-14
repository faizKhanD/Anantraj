// team-categories.seeder.js
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("team_categories", [
      { title: "Founder", slug: "founder", status: 1,  created_at: new Date(), updated_at: new Date() },
      { title: "Board of Directors", slug: "board-of-directors", status: 1,  created_at: new Date(), updated_at: new Date() },
      { title: "Our Leadership Team", slug: "our-leadership-team", status: 1,  created_at: new Date(), updated_at: new Date() },
      { title: "Data Center Team", slug:"data-center-team", status: 1,  created_at: new Date(), updated_at: new Date() },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("team_categories", {}, {});
  },
};
