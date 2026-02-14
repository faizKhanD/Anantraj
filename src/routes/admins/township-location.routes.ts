import { Router } from "express";
import {
  indexLocation,
  storeLocation,
  editLocation,
  updateLocation,
  destroyLocation
} from "../../controllers/admins/township-location-advantage.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();
router.get( "/", indexLocation);
router.post( "/", uploadMiddleware.none(), storeLocation);
router.patch( "/:id",  uploadMiddleware.none(), updateLocation);
router.get( "/:id", editLocation);
router.delete( "/:id", destroyLocation);
 

export {router as TownshipLocationRoutes };
