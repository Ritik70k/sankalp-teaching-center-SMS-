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

 
  const adminPassword = await bcrypt.hash(
  process.env.ADMIN_PASSWORD!,
  10
);

await prisma.user.create({
  data: {
    username: process.env.ADMIN_USERNAME!,
    password: adminPassword,
    role: "ADMIN"
  }
});

  await prisma.systemSetting.create({
    data: {
      id: 1,
      institutionName: "Sankalp Teaching Center",
      currencySymbol: "₹",
      defaultStudentFee: 15000.00,
      address: "Bihar, India"
    }
  });



  await prisma.activityLog.create({
  data: {
    user: "system",
    action: "Database Initialization",
    details: "Initial database setup completed."
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
