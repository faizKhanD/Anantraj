import { Router } from "express";
import { store,
update,
destroy,
Index,
getInvestorListing,
edit,
destroyFile
} from "../../controllers/admins/investors.controller";

import { uploadMiddleware } from "../../utils/upload";

const router = Router();

router.get('/', Index);
router.get('/get-investors-listing', getInvestorListing);
router.post('/', uploadMiddleware.fields([{ name: "file", maxCount: 1 }, { name: "q_1", maxCount: 1 }, { name: "q_2", maxCount: 1 }, { name: "q_3", maxCount: 1 }, { name: "q_4", maxCount: 1 }]), store);
router.get('/:id', edit);
router.patch('/:id', uploadMiddleware.fields([{ name: "file", maxCount: 1 }, { name: "q_1", maxCount: 1 }, { name: "q_2", maxCount: 1 }, { name: "q_3", maxCount: 1 }, { name: "q_4", maxCount: 1 }]), update);
router.delete('/:id', destroy);

router.delete('/single-file/:id/:key', destroyFile);



export {router as InvestorsRoutes}