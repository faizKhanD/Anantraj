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
import { ProjectLocationDestinationModel } from "./projectLocationDestination.model";



class ProjectLocation extends Model<
  InferAttributes<ProjectLocation>,
  InferCreationAttributes<ProjectLocation>
> {
  declare id: CreationOptional<number>;
  declare project_id: ForeignKey<Project["id"]>;
  declare destination_id: ForeignKey<ProjectLocationDestinationModel["id"]>;
  declare title: string;
  declare image: string | null;
  declare alt: string | null;
  declare distance_time: string | null;
  declare status: CreationOptional<number>;
}

ProjectLocation.init(
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
    destination_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    distance_time: {
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
    tableName: "project_location",
    timestamps: true,
  }
);

export { ProjectLocation as ProjectLocationModel };
