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



class ProjectLocationDestination extends Model<
  InferAttributes<ProjectLocationDestination>,
  InferCreationAttributes<ProjectLocationDestination>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare status: CreationOptional<number>;
}

ProjectLocationDestination.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "project_location_destination",
    timestamps: true,
  }
);

export { ProjectLocationDestination as ProjectLocationDestinationModel };
