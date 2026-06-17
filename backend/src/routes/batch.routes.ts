import { Router } from 'express';
import { getBatches, getBatchById, createBatch, updateBatch, deleteBatch } from '../controllers/batch.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateJWT as any);

router.get('/', getBatches);
router.get('/:id', getBatchById);
router.post('/', createBatch);
router.put('/:id', updateBatch);
router.delete('/:id', deleteBatch);

export default router;
