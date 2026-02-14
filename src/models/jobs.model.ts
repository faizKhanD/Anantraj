import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";

class Jobs extends Model<
  InferAttributes<Jobs>,
  InferCreationAttributes<Jobs>
> {
  declare id: CreationOptional<number>;
  declare job_title: string;
  declare location: string;
  declare education_required: string;
  declare experience_required: string;  // text, not number
  declare skills_required: string;
  declare status: CreationOptional<string>;
}

Jobs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    job_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,   // match migration
      allowNull: false,
    },
    education_required: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience_required: {
      type: DataTypes.TEXT,   // match migration
      allowNull: false,
    },
    skills_required: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("0", "1"),   // match migration
      allowNull: false,
      defaultValue: "1",
    },
  },
  {
    sequelize,
    tableName: "jobs",
    timestamps: true,
  }
);

export default Jobs;
