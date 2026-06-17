import { Router } from 'express';
import { getTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher } from '../controllers/teacher.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateJWT as any);

router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', upload.single('photo'), createTeacher);
router.put('/:id', upload.single('photo'), updateTeacher);
router.delete('/:id', deleteTeacher);

export default router;
