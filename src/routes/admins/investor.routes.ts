import { Router } from "express";
import {
  Store,
  Update
} from "../../controllers/admins/investorTypes.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();

router.post("/type", Store);
router.patch("/type/:id", Update);
// router.delete("/:id", DeleteTypology);
// router.get("/", GetTypologies);
// router.get("/:id", GetTypologyById);
export {router as investorRouter};
