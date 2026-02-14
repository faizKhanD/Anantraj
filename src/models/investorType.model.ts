import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";

class InvestorTypes extends Model<
  InferAttributes<InvestorTypes>,
  InferCreationAttributes<InvestorTypes>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare status: CreationOptional<number>;
}

InvestorTypes.init(
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
    tableName: "investor_types",
    timestamps: true,
  }
);

export default InvestorTypes;
