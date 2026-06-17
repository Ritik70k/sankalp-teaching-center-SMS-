-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('Cash', 'Online', 'Cheque', 'UPI', 'Bank Transfer');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('Present', 'Absent');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches" (
    "id" SERIAL NOT NULL,
    "batch_name" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "faculty_name" TEXT NOT NULL,
    "batch_timing" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "academic_year" TEXT NOT NULL,
    "end_date" DATE,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "student_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "date_of_birth" DATE,
    "photo" TEXT,
    "father_name" TEXT,
    "mother_name" TEXT,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "course" TEXT NOT NULL,
    "batch_id" INTEGER,
    "admission_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_fees" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "status" "Status" NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" SERIAL NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "photo" TEXT,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "qualification" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "joining_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monthly_salary" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "status" "Status" NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'Present',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "paid_amount" DECIMAL(10,2) NOT NULL,
    "payment_date" DATE NOT NULL,
    "payment_mode" "PaymentMode" NOT NULL DEFAULT 'Cash',
    "transaction_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_payments" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "paid_amount" DECIMAL(10,2) NOT NULL,
    "payment_date" DATE NOT NULL,
    "payment_mode" "PaymentMode" NOT NULL DEFAULT 'Cash',
    "transaction_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "institution_name" TEXT NOT NULL DEFAULT 'Sankalp Teaching Center',
    "currency_symbol" TEXT NOT NULL DEFAULT '₹',
    "default_student_fee" DECIMAL(10,2) NOT NULL DEFAULT 15000.00,
    "address" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "students_student_id_key" ON "students"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_teacher_id_key" ON "teachers"("teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_student_id_date_key" ON "attendances"("student_id", "date");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_payments" ADD CONSTRAINT "teacher_payments_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
