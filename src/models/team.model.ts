import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
import TeamCategories from "./teamcategories.model";


class Team extends Model<
  InferAttributes<Team>,
  InferCreationAttributes<Team>
> {
  declare id: CreationOptional<number>;
  declare is_team_board?: number;
  declare name: string;
  declare designation: string;
  declare image?: string|null;
  declare alt: string;
  declare short_description: string;
  declare long_description: string;
  declare directorship: object|null;
  declare din_number?: string;
  declare is_leadership: number;
  declare status: number;
  declare seq: number;
  declare home_seq: number;
  declare created_by?: number;
  declare modified_by?: number;
}

Team.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    is_team_board: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    short_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    long_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    directorship: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    din_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_leadership: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    seq: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    home_seq: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "teams",
    paranoid: false,
    timestamps: true, // 👈 adds createdAt, updatedAt
    deletedAt: "deleted_at",
  }
);

Team.belongsTo(TeamCategories, { foreignKey: "is_team_board", as: "teamcategories" });

export default Team;
