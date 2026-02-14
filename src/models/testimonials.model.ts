import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
import { allow } from "joi";
import { defaultValueSchemable, toDefaultValue } from "sequelize/lib/utils";


class Testimonials extends Model<
  InferAttributes<Testimonials>,
  InferCreationAttributes<Testimonials>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare image?: string|null;
  declare alt: string;
  declare short_description: string;
  declare rating : number;
  declare video_link : string;
  declare status: number;
  declare seq: number;
  declare created_by?: number;
  declare modified_by?: number;
}

Testimonials.init(
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
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    short_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5,
      },
    },
    video_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    seq: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    }
  },
  {
    sequelize,
    tableName: "testimonials",
    paranoid: false,
    timestamps: true, // 👈 adds createdAt, updatedAt
    deletedAt: "deleted_at",
  }
);


export default Testimonials;
