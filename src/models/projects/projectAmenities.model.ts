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
import AmenitiesLogo from "../amenitiesLoog.model";

class ProjectAmenities extends Model<
  InferAttributes<ProjectAmenities>,
  InferCreationAttributes<ProjectAmenities>
> {
  declare id: CreationOptional<number>;
  declare project_id: ForeignKey<Project["id"]>;
  declare logo_id: ForeignKey<AmenitiesLogo["id"]>;
  declare title: string;
  declare short_description: string;
  declare image: string | null;
  declare alt: string | null;
  declare status: CreationOptional<number>;
}

ProjectAmenities.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    logo_id: {
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
    short_description: {
      type: DataTypes.TEXT,
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
    tableName: "project_amenities",
    timestamps: true,
  }
);

export { ProjectAmenities as ProjectAmenitiesModel };
