import { Router } from "express";
import {
  AddTypology,
  UpdateTypology,
  DeleteTypology,
  GetTypologies,
  GetTypologyById,
} from "../../controllers/admins/typologies.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();

router.post("/", uploadMiddleware.none(), AddTypology);
router.patch("/:id", uploadMiddleware.none(), UpdateTypology);
router.delete("/:id", DeleteTypology);
router.get("/", GetTypologies);
router.get("/:id", GetTypologyById);
export default router;
