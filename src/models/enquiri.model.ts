import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from "sequelize";
  import { sequelize } from "../config/sequelize.config";
  
  class Enquiry extends Model<
    InferAttributes<Enquiry>,
    InferCreationAttributes<Enquiry>
  > {
    declare id: CreationOptional<number>;
    declare project_id: number;
    declare name: string;
    declare mobile: string;
    declare email: string;
    declare message: string;
    declare status: "0" | "1";
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
  }
  
  Enquiry.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      project_id: {
        type: DataTypes.INTEGER,
        defaultValue:0
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
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      modelName: "Enquiry",
      tableName: "enquiries",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  
  export default Enquiry;
  