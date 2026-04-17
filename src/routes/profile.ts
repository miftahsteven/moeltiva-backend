import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.get('/', getProfile);
router.put('/', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), updateProfile);

export default router;
