import AmenitiesLogo from "./amenitiesLoog.model";
import AwardGallery from "./award-gallery.model";
import Award from "./award.model";
import logoModel from "./logo.model";
import Platter from "./platter.model";
import PressKit from "./presskit.model";
import Project from "./project.model";
import { ProjectAmenitiesModel } from "./projects/projectAmenities.model";
import { ProjectFloorplanModel } from "./projects/projectFloorplan.model";
import { ProjectGalleriesModel } from "./projects/projectGalleries.model";
import { ProjectLocationModel } from "./projects/projectLocation.model";
import { ProjectLocationDestinationModel } from "./projects/projectLocationDestination.model";
import ProjectStatus from "./projectStatus.model";
import SubTypology from "./subtypologies.model";
import Team from "./team.model";
import TeamCategories from "./teamcategories.model";
import Typology from "./typologies.model";
import ConstructionProjects from "./construction_projects.model";
import {ConstructionUpdateProjectGalleryModel} from "./ConstructionUpdateprojectGalleries";
import ConstructionUpdateSubProjects from "./construction_update_sub_projects.model";



export const initializeAssociations = () => {
 
  Platter.hasMany(Project, {
    foreignKey: "platter_id",
    as: "projects",
  });

  ProjectAmenitiesModel.belongsTo(AmenitiesLogo, {
    foreignKey: "logo_id",
    as: "logo_data",
  });
  Project.belongsTo(Platter, {
    foreignKey: "platter_id",
    as: "platter",
  });
  
  Team.belongsTo(TeamCategories, {
    foreignKey: "is_team_board",
    as: "commity_member",
  });

  TeamCategories.hasMany(Team, {
    foreignKey: "is_team_board",
    as: "teams",
  });



  // project  
  Project.belongsTo(Typology, {
    foreignKey: "typologyId",
    as: "typology_data",
  });
  Project.belongsTo(SubTypology, {
    foreignKey: "subTypologyId",
    as: "sub_typology_data",
  });
  ProjectAmenitiesModel.belongsTo(AmenitiesLogo, {
    foreignKey: "logo_id",
    as: "amenities_data",
  });

  // ProjectFloorplanModel.belongsTo(SubTypology, {
  //   foreignKey: "sub_typologie_id",
  //   as: "sub_typologie_data",
  // });

  SubTypology.hasMany(ProjectFloorplanModel, {
    foreignKey: "sub_typologie_id", // column in ProjectFloorplanModel
    as: "ProjectFloorplans",        // alias for include
  });

  // ProjectFloorplan model
  ProjectFloorplanModel.belongsTo(SubTypology, {
    foreignKey: "sub_typologie_id", // points back to SubTypology
    as: "SubTypology",
  });

  AwardGallery.belongsTo(Award, {
    foreignKey: "award_id",
    as: "award_data",
  });


  Project.belongsTo(ProjectStatus, {
    foreignKey: "projectStatusId",
    as: "status_data",
  });
  ProjectStatus.hasMany(Project, {
    foreignKey: "projectStatusId",
    as: "projects",
  });


  Platter.belongsToMany(ProjectStatus, {
    through: Project,
    as: "statuses",
    foreignKey: "platterId",
    otherKey: "projectStatusId",
  });

 ProjectStatus.belongsToMany(Platter, {
  through: Project,
  as: "platters",
  foreignKey: "projectStatusId",
  otherKey: "platterId",
});
  // end project 

  ProjectLocationDestinationModel.hasMany(ProjectLocationModel, { foreignKey: "destination_id" });

  ProjectLocationModel.belongsTo(ProjectLocationDestinationModel, { foreignKey: "destination_id" });

  Project.hasMany(ProjectLocationModel, { foreignKey: "project_id" });
  ProjectLocationModel.belongsTo(Project, { foreignKey: "project_id" });


  PressKit.hasMany(logoModel, { foreignKey: "is_type", as: "PressLogos" });
  logoModel.belongsTo(PressKit, { foreignKey: "is_type", as: "PressKit" });


  Project.hasMany(ProjectGalleriesModel, {
    foreignKey: "project_id",
    as: "galleries",
  });

  ProjectGalleriesModel.belongsTo(Project, {
    foreignKey: "project_id",
    as: "project",
  });


  // ConstructionProject model
ConstructionProjects.hasMany(ConstructionUpdateSubProjects, {
  as: 'subprojects',
  foreignKey: 'construction_project_id'
});

ConstructionProjects.hasMany(ConstructionUpdateProjectGalleryModel, {
  as: 'project_gallery',
  foreignKey: 'construction_update_project_id'
});

// ConstructionSubProject model
ConstructionUpdateSubProjects.belongsTo(ConstructionProjects, {
  foreignKey: 'construction_project_id'
});

ConstructionUpdateSubProjects.hasMany(ConstructionUpdateProjectGalleryModel, {
  as: 'subproject_galleries',
  foreignKey: 'construction_update_sub_project_id'
});
ConstructionUpdateProjectGalleryModel.belongsTo(ConstructionUpdateSubProjects, {

  foreignKey: 'construction_update_sub_project_id'
});
};

export default initializeAssociations;
