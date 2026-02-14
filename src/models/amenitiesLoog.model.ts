import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";


class AmenitiesLogo extends Model<
  InferAttributes<AmenitiesLogo>,
  InferCreationAttributes<AmenitiesLogo>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare logo?: string|null;
  declare alt: string;
  declare status: number;
  declare created_by?: number;
  declare modified_by?: number;
}

AmenitiesLogo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "amenities_logos",
    paranoid: false,
    timestamps: true, // 👈 adds createdAt, updatedAt
    deletedAt: "deleted_at",
  }
);

export default AmenitiesLogo;
