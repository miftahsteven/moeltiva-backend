import { Router } from 'express';
import { getFooter, updateFooter } from '../controllers/footerController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getFooter);
router.put('/', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), updateFooter);

export default router;
