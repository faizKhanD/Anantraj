import express from "express";
import {
  Store,
  Update,
  Delete,
  Index,
  Edit,
} from "../../controllers/admins/award.controller";

import {
  storeGallery,GalleryList,EditGallery,UpdateGallery,
  DeleteGallery
} from "../../controllers/admins/award-gallery.controller";
import { uploadMiddleware } from "../../utils/upload";
const router = express.Router();
router.post("/", uploadMiddleware.single("file"), Store);
router.get("/", Index);

// gallery 
router.post("/gallery", uploadMiddleware.single("file"), storeGallery);
router.get("/gallery", GalleryList);
router.get("/gallery/:id", EditGallery);
router.patch("/gallery/:id", uploadMiddleware.single("file"), UpdateGallery);
router.delete("/gallery/:id", DeleteGallery);

// gallery 



router.get("/:id", Edit);
router.patch("/:id", uploadMiddleware.single("file"), Update);
router.delete("/:id", Delete);




export { router as awardRouter };
