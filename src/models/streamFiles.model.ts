import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
class StreamFile extends Model<
  InferAttributes<StreamFile>,
  InferCreationAttributes<StreamFile>
> {
  declare id: CreationOptional<number>;
  declare type: string;
  declare file: string;
}
StreamFile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "stream_files",
    paranoid: false,
    timestamps: true,
  }
);


export default StreamFile;
