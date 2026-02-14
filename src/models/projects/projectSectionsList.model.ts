import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/sequelize.config";
export interface ProjectSectionsAttributes {
  id: number;
  name: "banner" | "overview" | "amenities" | "highlight" | "floor_plan" | "location_advantage" | "gallery"  ;
  createdAt?: Date;
  updatedAt?: Date;
}
interface ProjectSectionsCreationAttributes
  extends Optional<ProjectSectionsAttributes, "id"> {}

class ProjectSectionsList
  extends Model<ProjectSectionsAttributes, ProjectSectionsCreationAttributes>
  implements ProjectSectionsAttributes
{
  public id!: number;
  public name!: "banner" | "overview" | "amenities" | "highlight" | "floor_plan" | "location_advantage" | "gallery";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProjectSectionsList.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.ENUM( "banner", "overview", "amenities", "highlight","floor_plan","location_advantage","gallery"),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "ProjectSection",
    tableName: "project_sections_list",
    timestamps: true,
    createdAt: "created_at", // 👈 force exact column name
    updatedAt: "updated_at",
  }
);

export {ProjectSectionsList as ProjectSecionModelList};
