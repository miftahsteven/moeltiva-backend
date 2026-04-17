import { Router } from 'express';
import { getHero, updateHero } from '../controllers/heroController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getHero);
router.put('/', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), updateHero);

export default router;
