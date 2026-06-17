import { Request, Response } from 'express';
import prisma from '../services/prisma.service';
import { logActivity } from '../utils/helper';
import { exec } from 'child_process';
import path from 'path';

export async function getSettings(req: Request, res: Response) {
  try {
    const setting = await prisma.systemSetting.findFirst();
    return res.json(setting);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updateSettings(req: Request, res: Response) {
  const { institutionName, currencySymbol, defaultStudentFee, address } = req.body;
  try {
    const updated = await prisma.systemSetting.upsert({
      where: { id: 1 },
      update: {
        institutionName,
        currencySymbol,
        defaultStudentFee: parseFloat(defaultStudentFee),
        address
      },
      create: {
        id: 1,
        institutionName,
        currencySymbol,
        defaultStudentFee: parseFloat(defaultStudentFee),
        address
      }
    });

    await logActivity('admin', 'Settings Updated', 'System configurations updated.');
    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function backupDatabase(req: Request, res: Response) {
  try {
    const [batches, students, teachers, attendances, payments, teacherPayments, logs, settings] = await Promise.all([
      prisma.batch.findMany(),
      prisma.student.findMany(),
      prisma.teacher.findMany(),
      prisma.attendance.findMany(),
      prisma.payment.findMany(),
      prisma.teacherPayment.findMany(),
      prisma.activityLog.findMany(),
      prisma.systemSetting.findFirst()
    ]);

    const backupData = {
      batches,
      students,
      teachers,
      attendance: attendances,
      payments,
      teacher_payments: teacherPayments,
      activity_logs: logs,
      settings
    };

    res.setHeader('Content-disposition', 'attachment; filename=sankalp_db_backup.json');
    res.setHeader('Content-type', 'application/json');
    return res.send(JSON.stringify(backupData, null, 2));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function restoreDatabase(req: Request, res: Response) {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: 'No data provided for restoration' });

  try {
    // Operations inside a clean transaction
    await prisma.$transaction(async (tx) => {
      await tx.activityLog.deleteMany({});
      await tx.payment.deleteMany({});
      await tx.teacherPayment.deleteMany({});
      await tx.attendance.deleteMany({});
      await tx.student.deleteMany({});
      await tx.teacher.deleteMany({});
      await tx.batch.deleteMany({});
      await tx.systemSetting.deleteMany({});

      if (data.settings) {
        await tx.systemSetting.create({ data: { ...data.settings, id: 1 } });
      }
      for (const b of (data.batches || [])) {
        await tx.batch.create({ data: { ...b, startDate: new Date(b.startDate), endDate: b.endDate ? new Date(b.endDate) : null } });
      }
      for (const t of (data.teachers || [])) {
        await tx.teacher.create({ data: { ...t, joiningDate: new Date(t.joiningDate) } });
      }
      for (const s of (data.students || [])) {
        await tx.student.create({ data: { ...s, dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth) : null, admissionDate: new Date(s.admissionDate) } });
      }
      for (const a of (data.attendance || [])) {
        await tx.attendance.create({ data: { ...a, date: new Date(a.date) } });
      }
      for (const p of (data.payments || [])) {
        await tx.payment.create({ data: { ...p, paymentDate: new Date(p.paymentDate) } });
      }
      for (const tp of (data.teacher_payments || [])) {
        await tx.teacherPayment.create({ data: { ...tp, paymentDate: new Date(tp.paymentDate) } });
      }
      for (const log of (data.activity_logs || [])) {
        await tx.activityLog.create({ data: { ...log, timestamp: new Date(log.timestamp) } });
      }
    });

    await logActivity('admin', 'Database Restored', 'Database restoration from JSON completed.');
    return res.json({ message: 'Database restored successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function resetDatabase(req: Request, res: Response) {
  try {
    const prismaSeedPath = path.join(__dirname, '..', 'prisma_seed.ts');
    exec(`npx ts-node ${prismaSeedPath}`, (err, stdout, stderr) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to reset database: ' + stderr });
      }
      return res.json({ message: 'Database reset to demo seeds successfully' });
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getActivityLogs(req: Request, res: Response) {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { timestamp: 'desc' }
    });
    return res.json(logs);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function clearActivityLogs(req: Request, res: Response) {
  try {
    await prisma.activityLog.deleteMany({});
    return res.json({ message: 'Activity logs cleared' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
