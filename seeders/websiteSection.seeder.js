module.exports = {
  up: async (queryInterface) => {
    const sections = [
      { name: "home_banner" },
      { name: "home_page_overview" },
      { name: "Home_page_counter" },
      { name: "about_us_overview" },
      { name: "vison_and_mission" },
      { name: "contact_info" },
      { name: "csr_overview" },
      {name:"career_overview"}
    ];

    for (const section of sections) {
      const existing = await queryInterface.rawSelect(
        "website_sections",
        {
          where: { name: section.name },
        },
        ["id"]
      );

      if (!existing) {
        await queryInterface.bulkInsert("website_sections", [
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
    await queryInterface.bulkDelete("website_sections", {
      name: [
        "home_banner",
        "home_page_overview",
        "Home_page_counter",
        "about_us_overview",
        "vison_and_mission",
        "contact_info",
        "csr_overview",
        "career_overview"
      ],
    });
  },
};
