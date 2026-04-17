import { Router } from 'express';
import { 
  getFaqSection, 
  updateFaqSection, 
  upsertUpgradeItem, 
  deleteUpgradeItem,
  upsertFaqItem,
  deleteFaqItem
} from '../controllers/faqController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.get('/', getFaqSection);
router.put('/section', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), updateFaqSection);
router.post('/upgrades', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), upsertUpgradeItem);
router.delete('/upgrades/:id', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), deleteUpgradeItem);
router.post('/faqs', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), upsertFaqItem);
router.delete('/faqs/:id', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), deleteFaqItem);

export default router;
