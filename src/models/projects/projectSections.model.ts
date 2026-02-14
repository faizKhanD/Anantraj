import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
 import { sequelize } from "../../config/sequelize.config";
import Project from "../project.model";
  class ProjectSecions extends Model<InferAttributes<ProjectSecions>, InferCreationAttributes<ProjectSecions>>{
        declare id:CreationOptional<number>;
        declare project_id:CreationOptional<number>;
        declare type:string;
        declare title?:string|null;
        declare description?: string|null;
        declare banner?:object|null;
        declare link?:string|null;
        declare other:object|null;
        declare sequence:number;
        declare status:string;
  }
  ProjectSecions.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Project, key: "id" },
    },

    type:{
        type:DataTypes.STRING, 
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
    sequence:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1
    },
    status:{
        type:DataTypes.ENUM("0","1"),
        defaultValue:"1"
    }
  },{
    sequelize,
    tableName:"project_sections",
    timestamps:true,

  })

  export {ProjectSecions as ProjectSecionModel};