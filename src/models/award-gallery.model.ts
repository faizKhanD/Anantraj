import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
class AwardGallery extends Model<InferAttributes<AwardGallery>, InferCreationAttributes<AwardGallery>> {
  declare id: CreationOptional<number>;
  declare award_id: number;
  declare image?: string | null;
  declare alt_text: string;
  declare status: number;
  declare created_by?: number;
  declare modified_by?: number;
}
AwardGallery.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    award_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alt_text: {
      type: DataTypes.TEXT,
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
    tableName: "award_gallery",
    paranoid: false,
    timestamps: true, 
  }
);
export default AwardGallery;
