import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";


class CsrGalleries extends Model<
  InferAttributes<CsrGalleries>,
  InferCreationAttributes<CsrGalleries>
> {
  declare id: CreationOptional<number>;
  declare year: number;
  declare image?: string|null;
  declare alt?: string | null;
  declare status: CreationOptional<number>;
  declare created_by?: number;
  declare modified_by?: number;
}
CsrGalleries.init(
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
    tableName: "csr_galleries",
    paranoid: false,
    timestamps: true,
    deletedAt: "deleted_at",
  }
);

export default CsrGalleries;
