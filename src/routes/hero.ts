import { Router } from 'express';
import { getHero, updateHero } from '../controllers/heroController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.get('/', getHero);
router.put('/', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), updateHero);

export default router;
