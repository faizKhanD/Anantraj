import express from "express";
import {
  Store,
  Update,
  Delete,
  Index,
  Edit,
} from "../../controllers/admins/csr.controller";
import { uploadMiddleware } from "../../utils/upload";
const router = express.Router();
router.post("/", uploadMiddleware.single("file"), Store);
router.get("/", Index);
router.get("/:id", Edit);

router.patch("/:id", uploadMiddleware.single("file"), Update);
router.delete("/:id", Delete);
export { router as csrRouter };
