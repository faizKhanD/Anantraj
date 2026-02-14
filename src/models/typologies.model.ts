import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";

class Typology extends Model<
  InferAttributes<Typology>,
  InferCreationAttributes<Typology>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare status: CreationOptional<number>;
}

Typology.init(
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
    tableName: "typologies",
    timestamps: true,
  }
);

export default Typology;
