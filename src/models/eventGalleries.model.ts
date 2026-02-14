import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";


class EventGalleries extends Model<
  InferAttributes<EventGalleries>,
  InferCreationAttributes<EventGalleries>
> {
  declare id: CreationOptional<number>;
  declare year: number;
  declare image?: string|null;
  declare alt?: string | null;
  declare status: CreationOptional<number>;
  declare created_at?: number;
  declare modified_at?: number;
}
EventGalleries.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    year:{
      type: DataTypes.INTEGER,
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
    tableName: "event_galleries",
    paranoid: false,
    timestamps: true,
  }
);
 
export { EventGalleries as EventGalleriesModel };