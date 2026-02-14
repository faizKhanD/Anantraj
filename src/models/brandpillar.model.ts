import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";


class BrandPillar extends Model<
  InferAttributes<BrandPillar>,
  InferCreationAttributes<BrandPillar>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare short_description: string;
  declare status: number;
  declare created_by?: number;
  declare modified_by?: number;
}

BrandPillar.init(
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
    short_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "brand_pillar",
    paranoid: false,
    timestamps: true, // 👈 adds createdAt, updatedAt
    deletedAt: "deleted_at",
  }
);
export default BrandPillar;
