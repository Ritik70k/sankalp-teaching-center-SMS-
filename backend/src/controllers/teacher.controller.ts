import { Request, Response } from 'express';
import prisma from '../services/prisma.service';
import { generateTeacherId, logActivity } from '../utils/helper';

export async function getTeachers(req: Request, res: Response) {
  const { search, status } = req.query;
  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { teacherId: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.status = status as any;
    }

    const teachers = await prisma.teacher.findMany({
      where,
      include: { payments: true },
      orderBy: { createdAt: 'desc' }
    });

    const activeCount = await prisma.teacher.count({ where: { status: 'Active' } });
    const monthlyBudget = teachers.reduce((acc, curr) => acc + (curr.status === 'Active' ? Number(curr.monthlySalary) : 0), 0);

    const enriched = teachers.map(t => {
      const paid = t.payments.reduce((acc, curr) => acc + Number(curr.paidAmount), 0);
      
      // Calculate months worked since joining
      const joinDate = new Date(t.joiningDate);
      const today = new Date();
      const months = (today.getFullYear() - joinDate.getFullYear()) * 12 + today.getMonth() - joinDate.getMonth() + 1;
      const expected = Number(t.monthlySalary) * Math.max(1, months);
      const remaining = Math.max(0, expected - paid);

      return {
        ...t,
        paid_salary: paid,
        total_salary: expected,
        remaining_salary: remaining
      };
    });

    return res.json({
      teachers: enriched,
      activeCount,
      monthlyBudget
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getTeacherById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: parseInt(id as string) },
      include: { payments: { orderBy: { paymentDate: 'desc' } } }
    });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const paid = teacher.payments.reduce((acc, curr) => acc + Number(curr.paidAmount), 0);
    const joinDate = new Date(teacher.joiningDate);
    const today = new Date();
    const months = (today.getFullYear() - joinDate.getFullYear()) * 12 + today.getMonth() - joinDate.getMonth() + 1;
    const expected = Number(teacher.monthlySalary) * Math.max(1, months);
    const remaining = Math.max(0, expected - paid);

    return res.json({
      ...teacher,
      paid_salary: paid,
      total_salary: expected,
      remaining_salary: remaining
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createTeacher(req: Request, res: Response) {
  const data = req.body;
  try {
    const teacherId = await generateTeacherId();
    const photo = req.file ? `/uploads/${req.file.filename}` : '';

    const newTeacher = await prisma.teacher.create({
      data: {
        teacherId,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        photo,
        mobile: data.mobile,
        email: data.email,
        address: data.address,
        qualification: data.qualification,
        subject: data.subject,
        joiningDate: data.joiningDate ? new Date(data.joiningDate) : new Date(),
        monthlySalary: parseFloat(data.monthlySalary || '0'),
        status: data.status || 'Active'
      }
    });

    await logActivity('admin', 'Teacher Created', `Created teacher ${teacherId} (${data.firstName} ${data.lastName})`);
    return res.status(201).json(newTeacher);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updateTeacher(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  try {
    const teacher = await prisma.teacher.findUnique({ where: { id: parseInt(id as string) } });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    const photo = req.file ? `/uploads/${req.file.filename}` : teacher.photo;

    const updated = await prisma.teacher.update({
      where: { id: parseInt(id as string) },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        photo,
        mobile: data.mobile,
        email: data.email,
        address: data.address,
        qualification: data.qualification,
        subject: data.subject,
        joiningDate: data.joiningDate ? new Date(data.joiningDate) : undefined,
        monthlySalary: data.monthlySalary ? parseFloat(data.monthlySalary) : undefined,
        status: data.status
      }
    });

    await logActivity('admin', 'Teacher Updated', `Updated teacher ${teacher.teacherId} (${data.firstName} ${data.lastName})`);
    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteTeacher(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const teacher = await prisma.teacher.findUnique({ where: { id: parseInt(id as string) } });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    await prisma.teacher.delete({ where: { id: parseInt(id as string) } });
    await logActivity('admin', 'Teacher Deleted', `Deleted teacher ${teacher.teacherId} (${teacher.firstName} ${teacher.lastName})`);
    return res.json({ message: 'Teacher deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
