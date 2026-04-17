import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getProfile);
router.put('/', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), updateProfile);

export default router;
