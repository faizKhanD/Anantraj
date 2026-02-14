import { Router } from "express";
import { getAllProjectStatuses } from "../../controllers/admins/projectstatus.controller";

const router = Router();

router.get("/", getAllProjectStatuses);

export default router;
