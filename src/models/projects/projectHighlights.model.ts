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

class ProjectHighlights extends Model<
  InferAttributes<ProjectHighlights>,
  InferCreationAttributes<ProjectHighlights>
> {
  declare id: CreationOptional<number>;
  declare project_id: ForeignKey<Project["id"]>;
  declare title: string;
  declare image: string | null;
  declare alt: string | null;
  declare status: CreationOptional<number>;
}

ProjectHighlights.init(
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "project_highlights",
    timestamps: true,
  }
);

export { ProjectHighlights as ProjectHighlightsModel };
