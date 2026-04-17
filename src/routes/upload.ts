import { Router } from 'express';
import upload from '../utils/upload.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ url: filePath });
});

export default router;
