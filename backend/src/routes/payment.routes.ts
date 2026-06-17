import { Router } from 'express';
import { getStudentPayments, createStudentPayment, deleteStudentPayment, getTeacherPayments, createTeacherPayment, getPendingFees } from '../controllers/payment.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateJWT as any);

router.get('/student', getStudentPayments);
router.post('/student', createStudentPayment);
router.delete('/student/:id', deleteStudentPayment);
router.get('/teacher', getTeacherPayments);
router.post('/teacher', createTeacherPayment);
router.get('/pending', getPendingFees);

export default router;
