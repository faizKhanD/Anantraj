import { Router } from "express";
import {
  AddSubTypology,
  DeleteSubTypology,
  GetSubTypologies,
  GetSubTypologyById,
  UpdateSubTypology,
} from "../../controllers/admins/typologies.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();

router.post("/", uploadMiddleware.none(), AddSubTypology);
router.patch("/:id", uploadMiddleware.none(), UpdateSubTypology);
router.delete("/:id", DeleteSubTypology);
router.get("/", GetSubTypologies);
router.get("/:id", GetSubTypologyById);
export default router;
