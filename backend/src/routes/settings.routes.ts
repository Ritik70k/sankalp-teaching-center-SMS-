import { Router } from 'express';
import { getSettings, updateSettings, backupDatabase, restoreDatabase, resetDatabase, getActivityLogs, clearActivityLogs } from '../controllers/settings.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateJWT as any);

router.get('/', getSettings);
router.put('/', updateSettings);
router.get('/backup', backupDatabase);
router.post('/restore', restoreDatabase);
router.post('/reset', resetDatabase);
router.get('/logs', getActivityLogs);
router.post('/logs/clear', clearActivityLogs);

export default router;
