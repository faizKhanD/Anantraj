import { Router } from "express";
import {
  Store,
  Index,
  Show,
  Delete
} from "../../controllers/admins/townshipAmenities.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();
router.post("/", uploadMiddleware.fields([{name: "desktop_file", maxCount:1}, {name: "mobile_file", maxCount: 1}, ]), Store);
router.get("/", Index);
router.get("/:id", Show);


router.delete("/:id", Delete);

export {router as townshipAmenitiesRoutes };
