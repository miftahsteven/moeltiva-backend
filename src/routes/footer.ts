import { Router } from 'express';
import { getFooter, updateFooter } from '../controllers/footerController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.get('/', getFooter);
router.put('/', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), updateFooter);

export default router;
