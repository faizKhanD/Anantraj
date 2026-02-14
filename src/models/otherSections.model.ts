import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
 import { sequelize } from "../config/sequelize.config";
  class OtherSections extends Model<InferAttributes<OtherSections>, InferCreationAttributes<OtherSections>>{
        declare id:CreationOptional<number>;
        declare type:string;
        declare title?:string|null;
        declare banner?:object|null;
        declare alt_text?:string|null;
        declare description?: string|null;
        declare link?:string|null;
        declare other:object|null;
        declare status:string;
  }
  OtherSections.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    type:{
        type:DataTypes.STRING,  // ENUM("home_banner","Home_page_counter")
        allowNull:false
    },
    title:{
      type:DataTypes.TEXT,
      allowNull:true
    },
   
    banner:{
      type:DataTypes.JSONB,
      allowNull:true
    },
    alt_text:{
      type:DataTypes.STRING,
      allowNull:true
    },
  
    description:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    link:{
        type:DataTypes.STRING,
        allowNull:true
    },
    other:{
        type:DataTypes.JSONB,
        allowNull:true
    },
    status:{
        type:DataTypes.ENUM("0","1"),
        defaultValue:"1"
    }
  },{
    sequelize,
    tableName:"other_sections",
    timestamps:true,

  })

  export default OtherSections;