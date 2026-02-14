import { Router } from "express";
import { store, update, destroy, Index, edit} from "../../controllers/admins/brandpillar.controller";
import { uploadMiddleware } from "../../utils/upload";


const router = Router();

router.post('/', uploadMiddleware.none(), store);
router.get('/', Index);
router.get('/:id', edit);
router.patch('/:id', uploadMiddleware.none(), update);
router.delete('/:id', destroy);


export default router;