import { Router } from "express";
import {
  AddProject,
  DeleteProject,
  getAllProjectSectionList,
  GetProjectById,
  GetProjects,
  UpdateProject,
  SaveAndUpdateSecions,
  getSectionDataByType
} from "../../controllers/admins/project.controller";
import { uploadMiddleware } from "../../utils/upload";
import { BannerList, StoreBanner ,UpdateBanner,EditBanner, DeleteBanner} from "../../controllers/admins/project/projectBanner.controller";
import { index, store , edit, update, destroy} from "../../controllers/admins/project/projectAmenities.controller";

import { 
  indexHighlight,
  storeHighlight,
  editHighlight,
  updateHighlight,
  destroyHighlight
} from "../../controllers/admins/project/projectHighlights.controller";

import { 
  indexSpecification,
  storeSpecification,
  editSpecification,
  updateSpecification,
  destroySpecification
} from "../../controllers/admins/project/projectSpecifications.controller";

import { 
  indexFloorplan,
  storeFloorplan,
  editFloorplan,
  updateFloorplan,
  destroyFloorplan
} from "../../controllers/admins/project/projectFloorplan.controller";

import { 
  indexLocation,
  storeLocation,
  editLocation,
  updateLocation,
  destroyLocation,
  getLocationDestination,
} from "../../controllers/admins/project/projectLocation.controller";

import { 
  indexGalleries,
  storeGalleries,
  editGalleries,
  updateGalleries,
  destroyGalleries,
  addAndUpdateUnderconstructionImageMark
} from "../../controllers/admins/project/projectGalleries.controller";

const router = Router();


router.get( "/all-sections", getAllProjectSectionList);
// banner routes
router.get( "/:id/project-banner",BannerList);
router.post( "/project-banner", uploadMiddleware.fields([{ name: "mobile_file", maxCount: 1 },{ name: "desktop_file", maxCount: 1 },]),StoreBanner);
router.patch( "/project-banner/:id", uploadMiddleware.fields([{ name: "mobile_file", maxCount: 1 },{ name: "desktop_file", maxCount: 1 },]),UpdateBanner);
router.get( "/project-banner/:id", EditBanner);
router.delete( "/project-banner/:id", DeleteBanner);
// banner routes


// amenities routes
router.get( "/:id/project-amenities", index);
router.post( "/project-amenities", uploadMiddleware.single("image"), store);
router.patch( "/project-amenities/:id", uploadMiddleware.single("image"), update);
router.get( "/project-amenities/:id", edit);
router.delete( "/project-amenities/:id", destroy);
// end amenities routes


// highlights routes
router.get( "/:id/project-highlights", indexHighlight);
router.post( "/project-highlights", uploadMiddleware.single("image"), storeHighlight);
router.patch( "/project-highlights/:id", uploadMiddleware.single("image"), updateHighlight);
router.get( "/project-highlights/:id", editHighlight);
router.delete( "/project-highlights/:id", destroyHighlight);
// end highlights routes


// specifications routes
router.get( "/:id/project-specifications", indexSpecification);
router.post( "/project-specifications", uploadMiddleware.single("image"), storeSpecification);
router.patch( "/project-specifications/:id", uploadMiddleware.single("image"), updateSpecification);
router.get( "/project-specifications/:id", editSpecification);
router.delete( "/project-specifications/:id", destroySpecification);
// end specifications routes

// floorplan routes
router.get( "/:id/project-floorplan/:type/list", indexFloorplan);
router.get( "/:id/project-floorplan", indexFloorplan);
router.post( "/project-floorplan", uploadMiddleware.single("image"), storeFloorplan);
router.patch( "/project-floorplan/:id", uploadMiddleware.single("image"), updateFloorplan);
router.get( "/project-floorplan/:id", editFloorplan);
router.delete( "/project-floorplan/:id", destroyFloorplan);
// end floorplan routes


// location routes
router.get( "/project-location-destination-list", getLocationDestination);
router.get( "/:id/project-location", indexLocation);
router.post( "/project-location", uploadMiddleware.single("image"), storeLocation);
router.patch( "/project-location/:id", uploadMiddleware.single("image"), updateLocation);
router.get( "/project-location/:id", editLocation);
router.delete( "/project-location/:id", destroyLocation);
// end location routes


// galleries routes
router.get( "/:id/project-galleries", indexGalleries);
router.post( "/project-galleries", uploadMiddleware.single("image"), storeGalleries);
router.patch( "/project-galleries/:id", uploadMiddleware.single("image"), updateGalleries);
router.get( "/project-galleries/:id", editGalleries);
router.delete( "/project-galleries/:id", destroyGalleries);
router.post( "/project-underconstruction-image-mark/:id", addAndUpdateUnderconstructionImageMark);

// end galleries routes



// sections 
router.post("/section",uploadMiddleware.fields([ { name: "desktop_file", maxCount: 1 }, { name: "mobile_file", maxCount: 1 }, ]), SaveAndUpdateSecions);
router.get("/section/:project_id/:type", getSectionDataByType);
//section 




router.post("/", uploadMiddleware.fields([ { name: "image", maxCount: 1 }, { name: "qr_logo", maxCount: 1 }, { name: "logo", maxCount: 1 },]), AddProject );
router.get("/", GetProjects);
router.get("/:id", GetProjectById);
router.patch( "/:id",  uploadMiddleware.fields([
    { name: "image", maxCount: 1 },
    { name: "qr_logo", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  UpdateProject
);
router.delete("/:id", DeleteProject);







export default router;
