import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  HasManyGetAssociationsMixin,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
import ConstructionProjects from "./construction_projects.model";
import { ConstructionUpdateProjectGalleryModel } from "./ConstructionUpdateprojectGalleries";

class ConstructionUpdateSubProjects extends Model<
  InferAttributes<ConstructionUpdateSubProjects>,
  InferCreationAttributes<ConstructionUpdateSubProjects>
> {
  declare id: CreationOptional<number>;
  declare construction_project_id: number;
  declare title: string;
  declare file?: string|null;
  declare status: CreationOptional<number>;
  declare subproject_galleries?: NonAttribute<ConstructionUpdateProjectGalleryModel[]>;

  // Optional: association mixins
  declare getSubproject_galleries: HasManyGetAssociationsMixin<ConstructionUpdateProjectGalleryModel>;

}
ConstructionUpdateSubProjects.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    construction_project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: ConstructionProjects, key: "id" },
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
    tableName: "construction_update_sub_projects",
    paranoid: false,
    timestamps: false,
  }
);
export default ConstructionUpdateSubProjects;
