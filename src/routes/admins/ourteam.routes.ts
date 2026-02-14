import { Router } from "express";
import { store, update, destroy, Index, edit, getTeamCategories, changeStatusLeadership} from "../../controllers/admins/teams.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();

// team categories
router.get('/categories', getTeamCategories);

router.post('/', uploadMiddleware.single('image'), store);
router.get('/', Index);
router.get('/:id', edit);
router.patch('/:id', uploadMiddleware.single('image'), update);
router.patch('/:id/leadership', uploadMiddleware.none(), changeStatusLeadership);
router.delete('/:id', destroy);

export default router;