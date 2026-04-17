import { Router } from 'express';
import { 
  getIngredientSection, 
  updateIngredientSection, 
  upsertIngredientItem, 
  deleteIngredientItem 
} from '../controllers/ingredientController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getIngredientSection);
router.put('/section', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), updateIngredientSection);
router.post('/items', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), upsertIngredientItem);
router.delete('/items/:id', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), deleteIngredientItem);

export default router;
