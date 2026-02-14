import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
import generateSlug from "../utils/slugify.utils";
import Project from "./project.model";
import { ProjectGalleriesModel } from "./projects/projectGalleries.model";

class Platter extends Model<
  InferAttributes<Platter>,
  InferCreationAttributes<Platter>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare heading:string;
  declare sub_heading?:string;
  declare platter_overview?:string;
  declare show_in_construction?:number | 0;

  declare slug: CreationOptional<string>;
  declare short_description: string;
  declare alt?: string;
  declare image: string | null;
  declare mobile_image: string | null;
  declare status: number;
  declare meta_title: string;
  declare meta_description: string;
  declare meta_keywords: string;
  declare seo_tags: string;
  declare body_tags: string;
  declare seq: number;
  declare link: string;
  declare galleries?: ProjectGalleriesModel[];
  declare projects?: Project[];

}

Platter.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    heading: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sub_heading: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    show_in_construction: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    platter_overview: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    alt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
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
    body_tags: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    seq: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "platters",
    timestamps: true,
    hooks: {
      beforeValidate: (platter: Platter) => {
        if (platter.name && !platter.slug) {
          platter.slug = generateSlug(platter.name);
        }
      },
      beforeCreate: (platter: Platter) => {
        platter.slug = generateSlug(platter.name);
      },
      beforeUpdate: (platter: Platter) => {
        platter.slug = generateSlug(platter.name);
      },
    },
  }
);


export default Platter;
