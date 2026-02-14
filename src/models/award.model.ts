import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
class Award extends Model<
  InferAttributes<Award>,
  InferCreationAttributes<Award>
> {
  declare id: CreationOptional<number>;
  declare year: number;
  declare title: string;
  declare description: string;
  declare file?: string|null;
  declare alt_txt?: string | null;
  declare status: CreationOptional<number>;
  declare created_by?: number;
  declare modified_by?: number;
}
Award.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    year:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alt_txt: {
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
    tableName: "awards",
    paranoid: false,
    timestamps: true,
    deletedAt: "deleted_at",
  }
);
export default Award;
