import { Router } from "express";
import { store, update, destroy, Index, edit} from "../../controllers/admins/amenitiesLogo.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();

router.get('/', Index);
router.post('/', uploadMiddleware.single('logo'), store);
router.get('/:id', edit);
router.patch('/:id', uploadMiddleware.single('logo'), update);
router.delete('/:id', destroy);

export { router as AmenitiesLogoRoutes };