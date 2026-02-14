import { Router } from "express";
import { store, update, destroy, Index, edit} from "../../controllers/admins/logo.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();

 
router.get('/', Index);
router.post('/', uploadMiddleware.single('image'), store);
router.get('/:id', edit);
router.patch('/:id', uploadMiddleware.single('image'), update);
router.delete('/:id', destroy);

export default router;