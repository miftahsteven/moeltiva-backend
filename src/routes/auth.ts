import { Router } from 'express';
import { login, setupMFA, verifyMFA, getUsers, createUser, updateUserRole, deleteUser } from '../controllers/authController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/setup-mfa', authenticateToken, setupMFA);
router.post('/verify-mfa', authenticateToken, verifyMFA);

// User Management (Admin only)
router.get('/users', authenticateToken, authorizeRole(['ADMIN']), getUsers);
router.post('/users', authenticateToken, authorizeRole(['ADMIN']), createUser);
router.put('/users/:id', authenticateToken, authorizeRole(['ADMIN']), updateUserRole);
router.delete('/users/:id', authenticateToken, authorizeRole(['ADMIN']), deleteUser);
router.post('/users/:id/reset-mfa', authenticateToken, authorizeRole(['ADMIN']), resetUserMFA);

export default router;
