import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
import generateSlug from "../utils/slugify.utils";


class Blog extends Model<InferAttributes<Blog>, InferCreationAttributes<Blog>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare slug: CreationOptional<string>;
  declare short_description: string;
  declare long_description: string;
  declare image?: string | null;
  declare mobile_image?: string | null;
  declare alt?: string | null;
  declare meta_title: string;
  declare meta_description: string;
  declare meta_keywords: string;
  declare seo_tags: string;
  declare status: number;
  declare date_at?: string | null;
  declare created_by?: number;
  declare modified_by?: number;
}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    short_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    long_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meta_title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meta_keywords: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    seo_tags: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    date_at: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "blogs",
    paranoid: false,
    timestamps: true, // 👈 adds createdAt, updatedAt
    deletedAt: "deleted_at",
  }
);
export default Blog;
