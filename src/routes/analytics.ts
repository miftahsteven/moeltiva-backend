import { Router } from 'express';
import { getVisitorStats, getRealtimeStats } from '../services/analyticsService';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/visitors', authenticateToken, async (req, res) => {
  try {
    const stats = await getVisitorStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching GA stats', error });
  }
});

router.get('/realtime', authenticateToken, async (req, res) => {
  try {
    const stats = await getRealtimeStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching GA realtime stats', error });
  }
});

export default router;
