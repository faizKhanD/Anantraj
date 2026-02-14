import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";

class SubTypology extends Model<
  InferAttributes<SubTypology>,
  InferCreationAttributes<SubTypology>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare status: CreationOptional<number>;
}

SubTypology.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "subtypologies",
    timestamps: true,
  }
);

export default SubTypology;
