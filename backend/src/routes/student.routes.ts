import { Router } from 'express';
import { getStudents, getStudentById, createStudent, updateStudent, deleteStudent } from '../controllers/student.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateJWT as any);

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', upload.single('photo'), createStudent);
router.put('/:id', upload.single('photo'), updateStudent);
router.delete('/:id', deleteStudent);

export default router;
