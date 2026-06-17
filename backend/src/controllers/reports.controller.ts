import { Request, Response } from 'express';
import prisma from '../services/prisma.service';

export async function getDashboardReports(req: Request, res: Response) {
  try {
    const [students, teachers, batches, payments, teacherPayments, attendances] = await Promise.all([
      prisma.student.findMany(),
      prisma.teacher.findMany(),
      prisma.batch.findMany({ include: { students: true } }),
      prisma.payment.findMany(),
      prisma.teacherPayment.findMany(),
      prisma.attendance.findMany()
    ]);

    // Financial calculations
    const totalExpectedFees = students.reduce((acc, curr) => acc + Number(curr.totalFees), 0);
    const totalCollectedFees = payments.reduce((acc, curr) => acc + Number(curr.paidAmount), 0);
    const pendingFees = Math.max(0, totalExpectedFees - totalCollectedFees);

    const totalPaidSalaries = teacherPayments.reduce((acc, curr) => acc + Number(curr.paidAmount), 0);
    const activeTeachers = teachers.filter(t => t.status === 'Active');
    const monthlySalaryBudget = activeTeachers.reduce((acc, curr) => acc + Number(curr.monthlySalary), 0);

    // Attendance stats
    const totalAttendanceCount = attendances.length;
    const presentAttendanceCount = attendances.filter(a => a.status === 'Present').length;
    const overallAttendancePct = totalAttendanceCount === 0 ? 0 : Math.round((presentAttendanceCount / totalAttendanceCount) * 100);

    // Batch distribution
    const batchBreakdown = batches.map(b => ({
      batchId: b.id,
      batchName: b.batchName,
      studentCount: b.students.length,
      facultyName: b.facultyName
    }));

    // Financial trends over last 6 months
    // In production we can build exact SQL group-by, here we return aggregated details
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const financialTrends = months.map((m, idx) => {
      const monthPayments = payments.filter(p => new Date(p.paymentDate).getMonth() === idx);
      const monthSalaries = teacherPayments.filter(tp => new Date(tp.paymentDate).getMonth() === idx);
      return {
        month: m,
        collected: monthPayments.reduce((acc, curr) => acc + Number(curr.paidAmount), 0),
        salaries: monthSalaries.reduce((acc, curr) => acc + Number(curr.paidAmount), 0)
      };
    });

    return res.json({
      stats: {
        totalStudents: students.length,
        activeStudents: students.filter(s => s.status === 'Active').length,
        totalTeachers: teachers.length,
        activeTeachers: activeTeachers.length,
        totalBatches: batches.length,
        totalExpectedFees,
        totalCollectedFees,
        pendingFees,
        totalPaidSalaries,
        monthlySalaryBudget,
        overallAttendancePct
      },
      batchBreakdown,
      financialTrends
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
