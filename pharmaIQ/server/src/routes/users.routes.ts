import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { listUsers, createUser, updateUser, deactivateUser } from '../controllers/users.controller';

const router = Router();
router.use(authenticate, authorize('admin'));

router.get('/', listUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deactivateUser);

export default router;
