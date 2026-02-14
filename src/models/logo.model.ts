import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
import PressKitModel from "./presskit.model";


class logoModel extends Model<
  InferAttributes<logoModel>,
  InferCreationAttributes<logoModel>
> {
  declare id: CreationOptional<number>;
  declare is_type: number;
  declare label: string;
  declare image?: string|null;
  declare alt?: string | null;
  declare status: CreationOptional<number>;
  declare created_by?: number;
  declare modified_by?: number;
}
logoModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    is_type:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "logos",
    paranoid: false,
    timestamps: true,
    deletedAt: "deleted_at",
  }
);

logoModel.belongsTo(PressKitModel, {
  foreignKey: "is_type",
  as: "presskit",
});

export default logoModel;
