import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize.config";
import ProjectStatus from "./projectStatus.model";
import Platter from "./platter.model";
import Typology from "./typologies.model";
import SubTypology from "./subtypologies.model";
import generateSlug from "../utils/slugify.utils";



interface Gallery {
  id: number;
  image: string;
  // other properties of Gallery (e.g., description, created_at, etc.)
}


interface PlatterAttributes {
  id: number;
  name: string;
  projects: Project[];  // Platter has an array of projects
}

class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare slug: CreationOptional<string>;
  declare address?: string;
  declare rera_no?: string;
  declare alt?: string;
  declare short_description?: string;
  declare status?: number;
  declare meta_title?: string;
  declare meta_description?: string;
  declare meta_keywords?: string;
  declare image?: string | null;
  declare logo?: string | null;
  declare qr_logo?: string | null;
  declare platterId: number;
  declare typologyId: number;
  declare subTypologyId: number;
  declare projectStatusId: number;
  declare link: string;
  declare is_township?: string;
  declare seo_tags?: string;
  declare body_tags?: string;

  galleries?: Gallery[];  // galleries will be populated later
  galleriesCount?: number;  // number of galleries
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: { type: DataTypes.STRING, allowNull: true },
    rera_no: { type: DataTypes.STRING, allowNull: true },
    alt: { type: DataTypes.STRING, allowNull: true },
    short_description: { type: DataTypes.TEXT, allowNull: true },

    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: ProjectStatus, key: "id" },
    },
    meta_title: { type: DataTypes.STRING, allowNull: true },
    meta_description: { type: DataTypes.TEXT, allowNull: true },
    meta_keywords: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
    logo: { type: DataTypes.STRING, allowNull: true },
    qr_logo: { type: DataTypes.STRING, allowNull: true },
    link: { type: DataTypes.STRING, allowNull: true },

    platterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Platter, key: "id" },
    },
    typologyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Typology, key: "id" },
    },
    subTypologyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: SubTypology, key: "id" },
    },
    projectStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: ProjectStatus, key: "id" },
    },
    is_township: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seo_tags: { type: DataTypes.STRING, allowNull: true },
    body_tags: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: "projects",
    timestamps: true,
    hooks: {
      beforeValidate: (project: Project) => {
        if (project.name && !project.slug) {
          project.slug = generateSlug(project.name);
        }
      },
      beforeCreate: (project: Project) => {
        project.slug = generateSlug(project.name);
      },
      beforeUpdate: (project: Project) => {
        project.slug = generateSlug(project.name);
      },
    },
  }
);

Project.belongsTo(ProjectStatus, {
  foreignKey: "projectStatusId",
  as: "projectstatus",
});


Project.belongsTo(Typology, { foreignKey: "typologyId", as: "typology" });
Project.belongsTo(SubTypology, {
  foreignKey: "subTypologyId",
  as: "subTypology",
});

export default Project;
