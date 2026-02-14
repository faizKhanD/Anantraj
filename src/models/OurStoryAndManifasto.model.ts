import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
import generateSlug from "../utils/slugify.utils";
class OurStoryAndManifasto extends Model<InferAttributes<OurStoryAndManifasto>, InferCreationAttributes<OurStoryAndManifasto>> {
  declare id: CreationOptional<number>;
  declare type: string;
  declare image?: string | null;
  declare alt_text: string;
  declare sequence: number;

  declare status: number;
}
OurStoryAndManifasto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
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
    sequence: {
      type: DataTypes.INTEGER,
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
    tableName: "brand_story_and_manifato",
    paranoid: false,
    timestamps: true,
  }
);
export default OurStoryAndManifasto;
