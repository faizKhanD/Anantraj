import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
class TownshipAmenities extends Model<InferAttributes<TownshipAmenities>, InferCreationAttributes<TownshipAmenities>> {
  declare id: CreationOptional<number>;
  declare amenities_logo_id: number;
  declare title?: string | null;
  declare banner?: object | null;
  declare alt_text?: string | null;
  declare status: string;
}
TownshipAmenities.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
 
  amenities_logo_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  banner: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  alt_text: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM("0", "1"),
    defaultValue: "1"
  }
}, {
  sequelize,
  tableName: "township_amenities",
  timestamps: true,

})

export   {TownshipAmenities as TownshipAmenitiesModel};