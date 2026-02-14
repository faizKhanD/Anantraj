import express from "express";
import { AddBlogFaq ,UpdateBlogFaq,DeleteFaq,Index, EditBlogFaq} from "../../controllers/admins/blogfaq.controller";
import { uploadMiddleware } from "../../utils/upload";


const router = express.Router();

router.post('/:id',uploadMiddleware.none(),AddBlogFaq);
router.get('/:id',Index);
router.get('/:blog_id/:id',EditBlogFaq);
router.patch('/:blog_id/:id',uploadMiddleware.none(),UpdateBlogFaq);
router.delete('/:id',DeleteFaq);


export {router as blogfaqRouter}