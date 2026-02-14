import { Router } from "express";
import { AddNews, UpdateNews, DeleteNews, Index, EditNews} from "../../controllers/admins/news.controller";
import { uploadMiddleware } from "../../utils/upload";

const router = Router();
router.post('/', uploadMiddleware.fields([{ name: "logo", maxCount: 1 }, { name: "image", maxCount: 1 }]), AddNews);
router.get('/', Index);
router.get('/:id', EditNews);
router.patch('/:id',uploadMiddleware.fields([{ name: "logo", maxCount: 1 }, { name: "image", maxCount: 1 }, ]), UpdateNews);
router.delete('/:id', DeleteNews);

export default router;