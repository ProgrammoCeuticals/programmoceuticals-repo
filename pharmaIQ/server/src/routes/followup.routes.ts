import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { getFollowUpQueue, updateFollowUp } from '../controllers/followup.controller';

const router = Router();
router.use(authenticate);

router.get('/queue', getFollowUpQueue);
router.put('/:id', authorize('admin', 'pharmacist', 'assistant'), updateFollowUp);

export default router;
