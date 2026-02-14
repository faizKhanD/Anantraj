import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "../config/sequelize.config";
class Admin extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare phone_number: string;
  declare password: string;
  declare created_by?: number;
  declare modified_by?: number;
}
Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
 
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
   
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
   
    password: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    
  
  },
  {
    sequelize,
    modelName: "Admin",
    tableName: "Admins",
    freezeTableName: true,
    timestamps: true,
  }
);
Admin.beforeCreate(async (admin) => {
  if (admin.password) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
});
Admin.beforeUpdate(async (admin) => {
  if (admin.changed("password")) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
});
export { Admin };
