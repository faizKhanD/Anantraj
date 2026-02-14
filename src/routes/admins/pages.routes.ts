import { Router } from "express";
import {
  Store,
  Update,
  Index,
  Show
} from "../../controllers/admins/page.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();
router.get("/", Index);

router.post("/",uploadMiddleware.fields([{ name: "file", maxCount: 1 }, { name: "mobile_image", maxCount: 1 }]), Store);
router.patch("/:id", uploadMiddleware.fields([{ name: "file", maxCount: 1 }, { name: "mobile_image", maxCount: 1 }]),Update);
router.get("/:id", Show);

export {router as PageRoutes}
