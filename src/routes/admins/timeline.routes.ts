import { Router } from "express";
import { store, update, destroy, Index, edit} from "../../controllers/admins/timeline.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();


router.post('/', uploadMiddleware.single('image'), store);
router.get('/', Index);
router.get('/:id', edit);
router.patch('/:id', uploadMiddleware.single('image'), update);
router.delete('/:id', destroy);


export default router;