import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize.config";
export interface WebsiteSectionsAttributes {
  id: number;
  name: "home_banner" | "Home_page_counter" | "about_us_overview" | "vison_and_mission" | "contact_info" | "csr_overview" |"home_page_overview" | "career_overview" ;
  createdAt?: Date;
  updatedAt?: Date;
}
interface WebsiteSectionsCreationAttributes
  extends Optional<WebsiteSectionsAttributes, "id"> {}

class WebsiteSections
  extends Model<WebsiteSectionsAttributes, WebsiteSectionsCreationAttributes>
  implements WebsiteSectionsAttributes
{
  public id!: number;
  public name!: "home_banner" | "Home_page_counter" | "about_us_overview" | "vison_and_mission" | "contact_info" | "csr_overview" | "home_page_overview" | "career_overview";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WebsiteSections.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.ENUM("home_banner", "Home_page_counter", "about_us_overview","vison_and_mission","contact_info","csr_overview","home_page_overview","career_overview"),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "WebsiteSections",
    tableName: "website_sections",
    timestamps: true,
    createdAt: "created_at", // 👈 force exact column name
    updatedAt: "updated_at",
  }
);

export {WebsiteSections as WebsiteSectionsModel};
