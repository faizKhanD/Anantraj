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


class ProjectGalleries extends Model<
  InferAttributes<ProjectGalleries>,
  InferCreationAttributes<ProjectGalleries>
> {
  declare id: CreationOptional<number>;
  declare type: string;
  declare video_link: string|null;
  declare project_id: ForeignKey<Project["id"]>;
  declare image: string|null;
  declare alt: string | null;
  declare year: string | null;
  declare is_construction: CreationOptional<number> | 0;
  declare status: CreationOptional<number>;
  declare created_at?: number;
  declare modified_at?: number;
  declare galleries?: ProjectGalleries[];
}
ProjectGalleries.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    video_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
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
    year: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_construction: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "project_galleries",
    paranoid: false,
    timestamps: true,
    deletedAt: "deleted_at",
  }
);

export { ProjectGalleries as ProjectGalleriesModel };
