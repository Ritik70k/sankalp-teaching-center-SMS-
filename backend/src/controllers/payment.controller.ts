import { Request, Response } from 'express';
import prisma from '../services/prisma.service';
import { logActivity } from '../utils/helper';

export async function getStudentPayments(req: Request, res: Response) {
  const { search, paymentMode, startDate, endDate } = req.query;
  try {
    const where: any = {};
    if (paymentMode) {
      where.paymentMode = paymentMode as any;
    }
    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) where.paymentDate.gte = new Date(startDate as string);
      if (endDate) where.paymentDate.lte = new Date(endDate as string);
    }
    if (search) {
      where.student = {
        OR: [
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } },
          { studentId: { contains: search as string, mode: 'insensitive' } },
        ]
      };
    }

    const payments = await prisma.payment.findMany({
      where,
      include: { student: { include: { batch: true } } },
      orderBy: { paymentDate: 'desc' }
    });

    const totalCollected = payments.reduce((acc, curr) => acc + Number(curr.paidAmount), 0);

    return res.json({ payments, totalCollected });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createStudentPayment(req: Request, res: Response) {
  const { studentId, paidAmount, paymentDate, paymentMode, transactionId, notes } = req.body;
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
      include: { payments: true }
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const totalPaid = student.payments.reduce((acc, curr) => acc + Number(curr.paidAmount), 0);
    const remaining = Number(student.totalFees) - totalPaid;
    
    if (parseFloat(paidAmount) <= 0) {
      return res.status(400).json({ error: 'Paid amount must be greater than zero' });
    }

    const payment = await prisma.payment.create({
      data: {
        studentId: parseInt(studentId),
        paidAmount: parseFloat(paidAmount),
        paymentDate: new Date(paymentDate),
        paymentMode,
        transactionId,
        notes
      }
    });

    await logActivity('admin', 'Fee Payment Recorded', `Recorded fee payment of ₹${paidAmount} for student ${student.studentId}`);
    return res.status(201).json(payment);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteStudentPayment(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const payment = await prisma.payment.findUnique({ where: { id: parseInt(id as string) }, include: { student: true } });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    await prisma.payment.delete({ where: { id: parseInt(id as string) } });
    await logActivity('admin', 'Payment Deleted', `Deleted payment transaction ${payment.transactionId || 'N/A'} for student ${payment.student.studentId}`);
    return res.json({ message: 'Payment deleted' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getTeacherPayments(req: Request, res: Response) {
  const { search, paymentMode, startDate, endDate } = req.query;
  try {
    const where: any = {};
    if (paymentMode) {
      where.paymentMode = paymentMode as any;
    }
    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) where.paymentDate.gte = new Date(startDate as string);
      if (endDate) where.paymentDate.lte = new Date(endDate as string);
    }
    if (search) {
      where.teacher = {
        OR: [
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } },
          { teacherId: { contains: search as string, mode: 'insensitive' } },
        ]
      };
    }

    const payments = await prisma.teacherPayment.findMany({
      where,
      include: { teacher: true },
      orderBy: { paymentDate: 'desc' }
    });

    const totalPaid = payments.reduce((acc, curr) => acc + Number(curr.paidAmount), 0);

    return res.json({ payments, totalPaid });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createTeacherPayment(req: Request, res: Response) {
  const { teacherId, paidAmount, paymentDate, paymentMode, transactionId, notes } = req.body;
  try {
    const teacher = await prisma.teacher.findUnique({ where: { id: parseInt(teacherId) } });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const payment = await prisma.teacherPayment.create({
      data: {
        teacherId: parseInt(teacherId),
        paidAmount: parseFloat(paidAmount),
        paymentDate: new Date(paymentDate),
        paymentMode,
        transactionId,
        notes
      }
    });

    await logActivity('admin', 'Salary Payment Recorded', `Recorded salary payout of ₹${paidAmount} for teacher ${teacher.teacherId}`);
    return res.status(201).json(payment);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getPendingFees(req: Request, res: Response) {
  try {
    const students = await prisma.student.findMany({
      where: { status: 'Active' },
      include: { batch: true, payments: true }
    });

    const pending = students.map(s => {
      const paid = s.payments.reduce((acc, curr) => acc + Number(curr.paidAmount), 0);
      const remaining = Number(s.totalFees) - paid;
      return {
        ...s,
        paid_amount: paid,
        remaining_fees: remaining
      };
    }).filter(s => s.remaining_fees > 0);

    return res.json(pending);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
