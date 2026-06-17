import prisma from '../services/prisma.service';

export async function generateStudentId(): Promise<string> {
  const lastStudent = await prisma.student.findFirst({
    orderBy: { id: 'desc' }
  });
  const num = lastStudent ? lastStudent.id + 1 : 1;
  return `STU-${String(num).padStart(4, '0')}`;
}

export async function generateTeacherId(): Promise<string> {
  const lastTeacher = await prisma.teacher.findFirst({
    orderBy: { id: 'desc' }
  });
  const num = lastTeacher ? lastTeacher.id + 1 : 1;
  return `TCH-${String(num).padStart(4, '0')}`;
}

export async function logActivity(user: string, action: string, details?: string) {
  try {
    await prisma.activityLog.create({
      data: { user, action, details }
    });
  } catch (error) {
    console.error('Failed to write activity log:', error);
  }
}
