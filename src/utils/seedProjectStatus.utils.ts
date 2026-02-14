import ProjectStatus from "../models/projectStatus.model";

export const seedProjectStatuses = async () => {
  const statuses = ["New Launch", "Under construction", "Completed"] as const;
  for (const status of statuses) {
    const existing = await ProjectStatus.findOne({ where: { name: status } });
    if (!existing) {
      await ProjectStatus.create({ name: status });
    }
  }
};
