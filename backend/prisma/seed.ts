import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.activityLog.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.teacherPayment.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.teacher.deleteMany({});
  await prisma.batch.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.systemSetting.deleteMany({});

  const adminPassword = await bcrypt.hash('admin', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    }
  });

  await prisma.systemSetting.create({
    data: {
      id: 1,
      institutionName: "Sankalp Teaching Center",
      currencySymbol: "₹",
      defaultStudentFee: 15000.00,
      address: "Delhi, India"
    }
  });

  await prisma.batch.create({
    data: {
      id: 1,
      batchName: "Class 10 - Science",
      courseName: "Science",
      facultyName: "Rajesh Kumar",
      batchTiming: "04:00 PM - 05:30 PM",
      startDate: new Date("2026-04-01"),
      academicYear: "2026-2027",
      endDate: new Date("2027-03-31"),
      description: "Daily science classes covering Physics, Chemistry, and Biology."
    }
  });

  await prisma.batch.create({
    data: {
      id: 2,
      batchName: "Class 12 - Physics",
      courseName: "Physics",
      facultyName: "Amit Sharma",
      batchTiming: "06:00 PM - 07:30 PM",
      startDate: new Date("2026-04-01"),
      academicYear: "2026-2027",
      endDate: new Date("2027-03-31"),
      description: "Advanced Physics batch for Class 12 Boards and JEE Main."
    }
  });

  await prisma.student.create({
    data: {
      id: 1,
      studentId: "STU-0001",
      firstName: "Rahul",
      lastName: "Sharma",
      gender: "Male",
      dateOfBirth: new Date("2010-05-15"),
      photo: "",
      fatherName: "Suresh Sharma",
      motherName: "Sunita Sharma",
      mobile: "9876543210",
      email: "rahul.sharma@example.com",
      address: "123, Sector 4, Rohini, Delhi",
      course: "Science",
      batchId: 1,
      admissionDate: new Date("2026-04-05"),
      totalFees: 15000.00,
      status: "Active"
    }
  });

  await prisma.student.create({
    data: {
      id: 2,
      studentId: "STU-0002",
      firstName: "Priya",
      lastName: "Verma",
      gender: "Female",
      dateOfBirth: new Date("2008-08-22"),
      photo: "",
      fatherName: "Manish Verma",
      motherName: "Kiran Verma",
      mobile: "9988776655",
      email: "priya.verma@example.com",
      address: "456, Pocket C, Dwarka, Delhi",
      course: "Physics",
      batchId: 2,
      admissionDate: new Date("2026-04-06"),
      totalFees: 18000.00,
      status: "Active"
    }
  });

  await prisma.teacher.create({
    data: {
      id: 1,
      teacherId: "TCH-0001",
      firstName: "Rajesh",
      lastName: "Kumar",
      gender: "Male",
      photo: "",
      mobile: "9555123456",
      email: "rajesh.kumar@example.com",
      address: "789, Janakpuri, Delhi",
      qualification: "M.Sc. Physics, B.Ed",
      subject: "Physics/Science",
      joiningDate: new Date("2025-01-10"),
      monthlySalary: 25000.00,
      status: "Active"
    }
  });

  await prisma.teacher.create({
    data: {
      id: 2,
      teacherId: "TCH-0002",
      firstName: "Amit",
      lastName: "Sharma",
      gender: "Male",
      photo: "",
      mobile: "9666778899",
      email: "amit.sharma@example.com",
      address: "101, Vikas Puri, Delhi",
      qualification: "M.Sc. Mathematics",
      subject: "Mathematics",
      joiningDate: new Date("2025-06-01"),
      monthlySalary: 30000.00,
      status: "Active"
    }
  });

  await prisma.payment.create({
    data: {
      id: 1,
      studentId: 1,
      paidAmount: 5000.00,
      paymentDate: new Date("2026-04-10"),
      paymentMode: "Online",
      transactionId: "TXN987654",
      notes: "First installment payment."
    }
  });

  await prisma.payment.create({
    data: {
      id: 2,
      studentId: 2,
      paidAmount: 18000.00,
      paymentDate: new Date("2026-04-12"),
      paymentMode: "UPI",
      transactionId: "UPI0099234",
      notes: "Full fee payment."
    }
  });

  await prisma.teacherPayment.create({
    data: {
      id: 1,
      teacherId: 1,
      paidAmount: 25000.00,
      paymentDate: new Date("2026-05-01"),
      paymentMode: "BankTransfer",
      transactionId: "SAL20260501",
      notes: "Salary for April 2026."
    }
  });

  await prisma.activityLog.create({
    data: {
      user: "admin",
      action: "Database Seeding",
      details: "Seed script ran successfully."
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
