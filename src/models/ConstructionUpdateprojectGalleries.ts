import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
import ConstructionProject from "./construction_projects.model";
import ConstructionUpdateSubProjects from "./construction_update_sub_projects.model";

class ConstructionUpdateProjectGallery extends Model<
  InferAttributes<ConstructionUpdateProjectGallery>,
  InferCreationAttributes<ConstructionUpdateProjectGallery>
> {
  declare id: CreationOptional<number>;


  declare construction_update_project_id: ForeignKey<ConstructionProject["id"]>;

  // Nullable sub project
  declare construction_update_sub_project_id: ForeignKey<ConstructionUpdateSubProjects["id"]> | null;

  declare type: string;
  declare video_link: string | null;
  declare month_year: string;
  declare image: string | null;
  declare alt: string | null;
  declare status: CreationOptional<number>;
  declare created_at?: Date;
  declare modified_at?: Date;

  
}

ConstructionUpdateProjectGallery.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    construction_update_project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ConstructionProject,
        key: "id",
      },
    },

    construction_update_sub_project_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // ✅ make nullable
      references: {
        model: ConstructionUpdateSubProjects,
        key: "id",
      },
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    video_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    month_year: {
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

    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "construction_update_project_galleries",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "modified_at",
  }
);

export { ConstructionUpdateProjectGallery as ConstructionUpdateProjectGalleryModel };
