import { Router } from "express";
import {
  Store,
  Update,
  Delete,
  Index,
  Show,
  getJobAllEnquiry
} from "../../controllers/admins/jobs.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();
router.get('/get-all-job-enquiry',getJobAllEnquiry);
router.post("/", Store);
router.patch("/:id", Update);
router.delete("/:id", Delete);
router.get("/", Index);
router.get("/:id", Show);




export {router as jobRoutes};
