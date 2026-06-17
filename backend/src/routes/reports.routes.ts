import { Router } from 'express';
import { getDashboardReports } from '../controllers/reports.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateJWT as any);

router.get('/dashboard', getDashboardReports);

export default router;
