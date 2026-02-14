import express from "express";
import {
  Store,Update,Index,Destroy, Show
} from "../../controllers/admins/construction_update_sub_projects.controller";
import { uploadMiddleware } from "../../utils/upload";
const router = express.Router();
router.get("/",  Index);
router.post("/", uploadMiddleware.single("file"), Store);
router.patch("/:id", uploadMiddleware.single("file"), Update);
router.delete("/:id", Destroy);
router.get("/:id", Show);



export { router as constructionUpdateSubProjectsRoutes };
