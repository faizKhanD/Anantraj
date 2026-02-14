import express from "express";
import { AddBlog ,UpdateBlog,Delete,Index,EditBlog} from "../../controllers/admins/blog.controller";
import { uploadMiddleware } from "../../utils/upload";
const router=express.Router();
router.post('/',uploadMiddleware.fields([{ name: "image", maxCount: 1 }, { name: "mobile_image", maxCount: 1 }]),AddBlog);


router.get('/',Index);
router.get('/:id',EditBlog);

router.patch('/:id',uploadMiddleware.fields([{ name: "image", maxCount: 1 }, { name: "mobile_image", maxCount: 1 }]),UpdateBlog);
router.delete('/:id',Delete);
export {router as blogRouter}
