import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
import generateSlug from "../utils/slugify.utils";


class Blog extends Model<InferAttributes<Blog>, InferCreationAttributes<Blog>> {
  declare id: CreationOptional<number>;
  declare blog_id: ForeignKey<Blog["id"]>;
  declare question: CreationOptional<string>;
  declare answer: string;
  declare created_at?: number;
  declare updated_at?: number;
}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.INTEGER,  
      allowNull: true,  
    },
    updated_at: {  
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "blog_faqs",
    paranoid: false,
    timestamps: true, // 👈 adds createdAt, updatedAt
    deletedAt: "deleted_at",
  }
);
export default Blog;
