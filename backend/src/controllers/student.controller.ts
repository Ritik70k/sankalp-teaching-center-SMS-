import { Request, Response } from 'express';
import prisma from '../services/prisma.service';
import { generateStudentId, logActivity } from '../utils/helper';
import { deleteCloudinaryImage } from "../utils/cloudinary.helper";

export async function getStudents(req: Request, res: Response) {
  const { search, batchId, status, page = '1', limit = '10' } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { studentId: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (batchId) {
      where.batchId = parseInt(batchId as string);
    }
    if (status) {
      where.status = status as any;
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limitNum,
        include: { batch: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.student.count({ where })
    ]);

    const activeCount = await prisma.student.count({ where: { status: 'Active' } });

    const enrichedStudents = await Promise.all(students.map(async (s) => {
      const payments = await prisma.payment.findMany({ where: { studentId: s.id } });
      const paid = payments.reduce((acc, curr) => acc + Number(curr.paidAmount), 0);
      const remaining = Math.max(0, Number(s.totalFees) - paid);
      const feeStatus = paid === 0 ? 'Pending' : paid >= Number(s.totalFees) ? 'Paid' : 'Partial';
      return {
        ...s,
        paid_amount: paid,
        remaining_fees: remaining,
        fee_status: feeStatus
      };
    }));

    return res.json({
      students: enrichedStudents,
      total,
      activeCount,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getStudentById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id as string) },
      include: { batch: true, payments: { orderBy: { paymentDate: 'desc' } }, attendances: { orderBy: { date: 'desc' } } }
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const paid = student.payments.reduce((acc, curr) => acc + Number(curr.paidAmount), 0);
    const remaining = Math.max(0, Number(student.totalFees) - paid);
    const feeStatus = paid === 0 ? 'Pending' : paid >= Number(student.totalFees) ? 'Paid' : 'Partial';

    const totalAttendance = student.attendances.length;
    const presentAttendance = student.attendances.filter(a => a.status === 'Present').length;
    const attendancePct = totalAttendance === 0 ? 0 : Math.round((presentAttendance / totalAttendance) * 100);

    return res.json({
      ...student,
      paid_amount: paid,
      remaining_fees: remaining,
      fee_status: feeStatus,
      attendance_percentage: attendancePct
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createStudent(req: Request, res: Response) {
  const data = req.body;
  try {
    const studentId = await generateStudentId();
    const photo = req.file ? (req.file as any).path : '';

    const newStudent = await prisma.student.create({
      data: {
        studentId,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        photo,
        fatherName: data.fatherName,
        motherName: data.motherName,
        mobile: data.mobile,
        email: data.email,
        address: data.address,
        course: data.course,
        batchId: data.batchId ? parseInt(data.batchId) : null,
        admissionDate: data.admissionDate ? new Date(data.admissionDate) : new Date(),
        totalFees: parseFloat(data.totalFees || '0'),
        status: data.status || 'Active'
      }
    });
    await logActivity('admin', 'Student Created', `Created student ${studentId} (${data.firstName} ${data.lastName})`);
    return res.status(201).json(newStudent);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updateStudent(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  try {
    const student = await prisma.student.findUnique({ where: { id: parseInt(id as string) } });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    let photo = student.photo;

    if (req.file) {
      if (student.photo) {
        await deleteCloudinaryImage(student.photo);
      }

      photo = (req.file as any).path;
    }

    const updated = await prisma.student.update({
      where: { id: parseInt(id as string) },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        photo,
        fatherName: data.fatherName,
        motherName: data.motherName,
        mobile: data.mobile,
        email: data.email,
        address: data.address,
        course: data.course,
        batchId: data.batchId ? parseInt(data.batchId) : null,
        admissionDate: data.admissionDate ? new Date(data.admissionDate) : undefined,
        totalFees: data.totalFees ? parseFloat(data.totalFees) : undefined,
        status: data.status
      }
    });
    await logActivity('admin', 'Student Updated', `Updated student ${student.studentId} (${data.firstName} ${data.lastName})`);
    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteStudent(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({ where: { id: parseInt(id as string) } });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    if (student.photo) {
      await deleteCloudinaryImage(student.photo);
    }

    await prisma.student.delete({
      where: { id: parseInt(id as string) }
    });
    await logActivity('admin', 'Student Deleted', `Deleted student ${student.studentId} (${student.firstName} ${student.lastName})`);
    return res.json({ message: 'Student deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
