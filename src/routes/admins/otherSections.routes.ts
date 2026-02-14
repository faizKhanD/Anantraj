import { Router } from "express";
import { getSectionByType, Store
} from "../../controllers/admins/otherSections.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();

router.get("/get-bytype/:type", getSectionByType);
router.post("/",uploadMiddleware.fields([

    { name: "desktop_file", maxCount: 1 },
    { name: "mobile_file", maxCount: 1 },
  
]), Store);
export {router as OtherSectionsRoutes}
