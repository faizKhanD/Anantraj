import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";



class Investors extends Model<
  InferAttributes<Investors>,
  InferCreationAttributes<Investors>
> {
  declare id: CreationOptional<number>;
  declare parent_id: number | null;
  declare link: string | null;
  declare year: string | null;
  declare title: string | null;
  declare file: string | null;
  declare file_list: Object | null;
  declare other: Object | null;
  declare description: string | null;
  declare permissions: string | null;
  declare seq: CreationOptional<boolean>;
}

Investors.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
   
    file: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    other: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    permissions: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: true,
    },
   
    file_list: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    seq:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    }
  },
  {
    sequelize,
    tableName: "investors",
    timestamps: true,
  }
);

export { Investors as InvestorsModel };