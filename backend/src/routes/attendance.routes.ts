import { Router } from 'express';
import { getAttendanceHistory, recordBulkAttendance } from '../controllers/attendance.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateJWT as any);

router.get('/history', getAttendanceHistory);
router.post('/bulk', recordBulkAttendance);

export default router;
