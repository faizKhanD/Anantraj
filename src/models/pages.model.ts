import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
 import { sequelize } from "../config/sequelize.config";
import generateSlug from "../utils/slugify.utils";
  class Pages extends Model<InferAttributes<Pages>, InferCreationAttributes<Pages>>{
        declare id:CreationOptional<number>;
        declare name:string;
        declare description:CreationOptional<string>;
         declare banner?: string|null;
        declare mobile_image?: string|null;
        declare slug:CreationOptional<string>;
        declare meta_title:string;
        declare meta_description:string;
        declare meta_keywords:string;
        declare seo_tags?:string;
        declare body_tags?:string;
        declare status:string;
        declare file?: string|null;
  }
  Pages.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.ENUM("Index","About","Gallery","Our Project","Contact","CSR","Media Center","Career","Our Blogs","Awards","Testimonial","Investor","Privacy","Disclaimer","team_categories" ),
        allowNull:false
    },
    description:{
      type:DataTypes.TEXT,
      allowNull:true
    },
    banner:{
      type:DataTypes.TEXT,
      allowNull:true
    },
    mobile_image:{
      type:DataTypes.TEXT,
      allowNull:true
    },
    slug:{
        type:DataTypes.STRING,
        allowNull:true,
        unique:true
    },
    meta_title:{
        type:DataTypes.STRING,
        allowNull:true
    },
    meta_description:{
        type:DataTypes.STRING,
        allowNull:true
    },
    meta_keywords:{
        type:DataTypes.STRING,
        allowNull:true
    },
    seo_tags:{
        type:DataTypes.STRING,
        allowNull:true
    },
    body_tags:{
        type:DataTypes.STRING,
        allowNull:true
    },
    status:{
        type:DataTypes.ENUM("0","1"),
        defaultValue:"1"
    }
  },{
    sequelize,
    tableName:"pages",
    timestamps:true,
        hooks: {
      beforeValidate: (page: Pages) => {
        if (page.name && !page.slug) {
          page.slug = generateSlug(page.name);
        }
      },
      beforeCreate: (page: Pages) => {
        page.slug = generateSlug(page.name);
      },
      beforeUpdate: (page: Pages) => {
        page.slug = generateSlug(page.name);
      },
    },

  })

  export default Pages;