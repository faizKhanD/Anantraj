import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";



class PressKit extends Model<
  InferAttributes<PressKit>,
  InferCreationAttributes<PressKit>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare image: string | null;
  declare alt_text: string | null;

}

PressKit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    alt_text: {
        type: DataTypes.STRING,
        allowNull: true,
    }
  },
  {
    sequelize,
    tableName: "presskit_logos",
    timestamps: true,
   
  }
);


export default PressKit;
