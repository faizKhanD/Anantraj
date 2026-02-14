import { Request, Response } from "express";
import ProjectStatus from "../../models/projectStatus.model";

export const getAllProjectStatuses = async (req: Request, res: Response) => {
  try {
    const statuses = await ProjectStatus.findAll({
      attributes: ["id", "name"],
      order: [["id", "ASC"]],
    });
    res.status(200).json({ success: true, data: statuses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
