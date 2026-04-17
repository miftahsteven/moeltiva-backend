import { Router } from 'express';
import { 
  getFindUsSection, 
  updateFindUsSection, 
  upsertPlatformItem, 
  deletePlatformItem 
} from '../controllers/findUsController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.get('/', getFindUsSection);
router.put('/section', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), updateFindUsSection);
router.post('/platforms', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), upsertPlatformItem);
router.delete('/platforms/:id', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), deletePlatformItem);

export default router;
