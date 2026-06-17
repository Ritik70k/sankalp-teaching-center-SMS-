import express from 'express';
import cors from 'cors';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import teacherRoutes from './routes/teacher.routes';
import batchRoutes from './routes/batch.routes';
import attendanceRoutes from './routes/attendance.routes';
import paymentRoutes from './routes/payment.routes';
import settingsRoutes from './routes/settings.routes';
import reportsRoutes from './routes/reports.routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for photo uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes API setup
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reports', reportsRoutes);

// General health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
