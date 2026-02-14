import express from "express";

import { 
     getTownshipProjects,
     getProjectSections,
     getProjectData,
     getBanner,
     getProjectAmenities,
     getHighlights, 
     getFloorPlans,
     getLocationAdvantage,
     getProjectGallery,
     getSpecifications,
     getProjectConstructionGallery
} from "../../controllers/website/project.controller";
import { uploadMiddleware } from "../../utils/upload";




const projectRoutes = express();

projectRoutes.get("/township-projects", getTownshipProjects);
projectRoutes.get("/:slug", getProjectData);
projectRoutes.get("/:project_id/banner", getBanner);

projectRoutes.get("/:project_id/sections", getProjectSections);
projectRoutes.get("/:project_id/amenities", getProjectAmenities);
projectRoutes.get("/:project_id/highlights", getHighlights);
projectRoutes.get("/:project_id/specifications", getSpecifications);
projectRoutes.get("/:project_id/floor-plans", getFloorPlans);
projectRoutes.get("/:project_id/location-advantage", getLocationAdvantage);
projectRoutes.get("/:project_id/gallery", getProjectGallery);
projectRoutes.get("/:project_id/construction-gallery", getProjectConstructionGallery);








export default projectRoutes;