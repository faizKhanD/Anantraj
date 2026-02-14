import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
import Team from "./team.model";


class TeamCategories extends Model<
  InferAttributes<TeamCategories>,
  InferCreationAttributes<TeamCategories>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare slug: string;
  declare status: number;
  declare seq: number;
  declare show_tab: number;
  declare created_by?: number;
  declare modified_by?: number;
  declare teams?: Team[]; 
  declare getTeams: HasManyGetAssociationsMixin<Team>;

}

TeamCategories.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    seq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    show_tab: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "team_categories",
    paranoid: false,
    timestamps: true, // 👈 adds createdAt, updatedAt
    deletedAt: "deleted_at",
  }
);
export default TeamCategories;
