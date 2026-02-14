import express from "express";
import { Store ,Update,Delete,Index,Edit} from "../../controllers/admins/OurStoryAndManifasto.controller";
import { uploadMiddleware } from "../../utils/upload";
const router=express.Router();
router.post('/',uploadMiddleware.single('image'),Store);
router.get('/',Index);
router.get('/:id',Edit);

router.patch('/:id',uploadMiddleware.single('image'),Update);
router.delete('/:id',Delete);
export {router as OurStoryAndManifastoRouter}
