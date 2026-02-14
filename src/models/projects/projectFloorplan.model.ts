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
import SubTypologies from "../subtypologies.model";

class ProjectFloorplan extends Model<
  InferAttributes<ProjectFloorplan>,
  InferCreationAttributes<ProjectFloorplan>
> {
  declare id: CreationOptional<number>;
  declare project_id: ForeignKey<Project["id"]>;
  declare sub_typologie_id: ForeignKey<SubTypologies["id"]>;
  declare title: string;
  declare image: string | null;
  declare alt: string | null;
  declare type: "floorplan" | "masterplan"; // 👈 New ENUM type in TS
  declare status: CreationOptional<number>;
}

ProjectFloorplan.init(
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
    sub_typologie_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("floorplan", "masterplan"), // 👈 New ENUM field
      allowNull: false,
      defaultValue: "floorplan",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "project_floorplan",
    timestamps: true,
  }
);

export { ProjectFloorplan as ProjectFloorplanModel };
