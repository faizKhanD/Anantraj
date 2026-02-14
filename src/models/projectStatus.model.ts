import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize.config";

export interface ProjectStatusAttributes {
  id: number;
  name: "New Launch" | "Under construction" | "Completed";
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectStatusCreationAttributes
  extends Optional<ProjectStatusAttributes, "id"> {}

class ProjectStatus
  extends Model<ProjectStatusAttributes, ProjectStatusCreationAttributes>
  implements ProjectStatusAttributes
{
  public id!: number;
  public name!: "New Launch" | "Under construction" | "Completed";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProjectStatus.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.ENUM("New Launch", "Under construction", "Completed"),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "ProjectStatus",
    tableName: "project_statuses",
    timestamps: true,
  }
);

export default ProjectStatus;
