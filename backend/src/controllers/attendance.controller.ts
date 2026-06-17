import { Request, Response } from 'express';
import prisma from '../services/prisma.service';
import { logActivity } from '../utils/helper';

export async function getAttendanceHistory(req: Request, res: Response) {
  const { batchId, date, search } = req.query;
  try {
    const where: any = {};
    if (date) {
      where.date = new Date(date as string);
    }
    if (batchId || search) {
      where.student = {};
      if (batchId) {
        where.student.batchId = parseInt(batchId as string);
      }
      if (search) {
        where.student.OR = [
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } },
          { studentId: { contains: search as string, mode: 'insensitive' } },
        ];
      }
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: { batch: true }
        }
      },
      orderBy: { date: 'desc' }
    });

    return res.json(attendance);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function recordBulkAttendance(req: Request, res: Response) {
  const { date, records } = req.body; // records: [{ studentId: number, status: 'Present'|'Absent' }]
  if (!date || !records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Date and records array are required' });
  }

  const attendanceDate = new Date(date);
  try {
    const operations = records.map(rec => prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: rec.studentId,
          date: attendanceDate
        }
      },
      update: { status: rec.status },
      create: {
        studentId: rec.studentId,
        date: attendanceDate,
        status: rec.status
      }
    }));

    await prisma.$transaction(operations);
    await logActivity('admin', 'Attendance Marked', `Marked attendance for ${records.length} students on ${date}`);
    return res.json({ message: 'Attendance updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
