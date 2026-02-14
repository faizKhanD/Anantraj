import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from "sequelize";
  import { sequelize } from "../config/sequelize.config";
  
  class JobForm extends Model<
    InferAttributes<JobForm>,
    InferCreationAttributes<JobForm>
  > {
    declare id: CreationOptional<number>;
    declare name: string;
    declare mobile: string;
    declare email: string;
    declare profile: string;
    declare skills: string;
    declare experience: string;
    declare resume: string | null;
    declare status: "0" | "1";
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
  }
  
  JobForm.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      skills: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      experience: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      resume: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("0", "1"),
        allowNull: false,
        defaultValue: "0",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "JobForm",
      tableName: "job_forms",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  
  export default JobForm;
  