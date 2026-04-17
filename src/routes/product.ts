import { Router } from 'express';
import { 
  getProductSection, 
  updateProductSection, 
  upsertProductStat, 
  deleteProductStat 
} from '../controllers/productController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.get('/', getProductSection);
router.put('/section', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), updateProductSection);
router.post('/stats', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), upsertProductStat);
router.delete('/stats/:id', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), deleteProductStat);

export default router;
