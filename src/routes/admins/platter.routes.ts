import { Router } from "express";
import {
  AddPlatter,
  UpdatePlatter,
  DeletePlatter,
  GetPlatters,
  GetPlatterById,
  addAndUpdateUnderconstructionMark,
} from "../../controllers/admins/platter.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();
router.post("/", uploadMiddleware.fields([{name: "image", maxCount:1}, {name: "mobile_image", maxCount: 1}, ]), AddPlatter);
router.get("/", GetPlatters);
router.patch("/:id", uploadMiddleware.fields([{name: "image", maxCount:1}, {name: "mobile_image", maxCount: 1}, ]), UpdatePlatter);
router.delete("/:id", DeletePlatter);
router.get("/:id", GetPlatterById);

router.post( "/show-in-underconstruction/:id", addAndUpdateUnderconstructionMark);



export default router;
