module.exports = {
  up: async (queryInterface) => {
    const sections = [
      { name: "banner" },
      { name: "overview" },
      { name: "amenities" },
      { name: "highlight" },
      { name: "floor_plan" },
      { name: "location_advantage" },
      { name: "gallery" },
      { name: "specification" },

    ];

    for (const section of sections) {
      const existing = await queryInterface.rawSelect(
        "project_sections_list",
        {
          where: { name: section.name },
        },
        ["id"]
      );

      if (!existing) {
        await queryInterface.bulkInsert("project_sections_list", [
          {
            name: section.name,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]);
      }
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("project_sections_list", {
      name: [
        "banner",
        "overview",
        "amenities",
        "highlight",
        "floor_plan",
        "location_advantage",
        "gallery",
      ],
    });
  },
};
