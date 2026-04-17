import { Router } from 'express';
import { 
  getBenefitSection, 
  updateBenefitSection, 
  upsertBenefitItem, 
  deleteBenefitItem 
} from '../controllers/benefitController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.get('/', getBenefitSection);
router.put('/section', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), updateBenefitSection);
router.post('/items', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), upsertBenefitItem);
router.delete('/items/:id', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), deleteBenefitItem);

export default router;
