import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../../config/sequelize.config";
import Project from "../project.model";

class ProjectBanner extends Model<
  InferAttributes<ProjectBanner>,
  InferCreationAttributes<ProjectBanner>
> {
  declare id: CreationOptional<number>;
  declare project_id: ForeignKey<Project["id"]>;
  declare desktop_file: string;
  declare mobile_file: string | null;
  declare alt_text: string | null;
  declare status: CreationOptional<number>;
}

ProjectBanner.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    desktop_file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alt_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "project_banner",
    timestamps: true,
  }
);

export { ProjectBanner as ProjectBannerModel };
