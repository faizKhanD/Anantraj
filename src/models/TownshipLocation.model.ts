import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
import Platter from "./platter.model";



class TownShipLocation extends Model<
  InferAttributes<TownShipLocation>,
  InferCreationAttributes<TownShipLocation>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare distance_time: string | null;
  declare status: CreationOptional<number>;
}

TownShipLocation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
   
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distance_time: {
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
    tableName: "township_location",
    timestamps: true,
  }
);

export { TownShipLocation as TownShipLocationModel };
