import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
import Platter from "./platter.model";
import ConstructionUpdateSubProjects from "./construction_update_sub_projects.model";
import { ConstructionUpdateProjectGalleryModel } from "./ConstructionUpdateprojectGalleries";
class ConstructionProjects extends Model<
  InferAttributes<ConstructionProjects>,
  InferCreationAttributes<ConstructionProjects>
> {
  declare id: CreationOptional<number>;
  declare platter_id: number;
  declare title: string;
  declare file?: string|null;
  declare status: CreationOptional<number>;
  declare subprojects?: ConstructionUpdateSubProjects[];
  declare project_gallery?: ConstructionUpdateProjectGalleryModel[];

}
ConstructionProjects.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    platter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Platter, key: "id" },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file: {
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
    tableName: "construction_projects",
    paranoid: false,
    timestamps: false,
  }
);
export default ConstructionProjects;
