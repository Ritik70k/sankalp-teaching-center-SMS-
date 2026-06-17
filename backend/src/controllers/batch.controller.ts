import { Request, Response } from 'express';
import prisma from '../services/prisma.service';
import { logActivity } from '../utils/helper';

export async function getBatches(req: Request, res: Response) {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        students: {
          where: { status: 'Active' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const enriched = batches.map(b => ({
      ...b,
      student_count: b.students.length
    }));

    return res.json(enriched);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getBatchById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const batch = await prisma.batch.findUnique({
      where: { id: parseInt(id as string) },
      include: { students: true }
    });
    if (!batch) return res.status(404).json({ error: 'Batch not found' });
    return res.json(batch);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createBatch(req: Request, res: Response) {
  const data = req.body;
  try {
    const newBatch = await prisma.batch.create({
      data: {
        batchName: data.batchName,
        courseName: data.courseName,
        facultyName: data.facultyName,
        batchTiming: data.batchTiming,
        startDate: new Date(data.startDate),
        academicYear: data.academicYear,
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description
      }
    });

    await logActivity('admin', 'Batch Created', `Created batch ${data.batchName}`);
    return res.status(201).json(newBatch);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updateBatch(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated = await prisma.batch.update({
      where: { id: parseInt(id as string) },
      data: {
        batchName: data.batchName,
        courseName: data.courseName,
        facultyName: data.facultyName,
        batchTiming: data.batchTiming,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        academicYear: data.academicYear,
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description
      }
    });

    await logActivity('admin', 'Batch Updated', `Updated batch ${data.batchName}`);
    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteBatch(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const batch = await prisma.batch.findUnique({ where: { id: parseInt(id as string) } });
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    await prisma.batch.delete({ where: { id: parseInt(id as string) } });
    await logActivity('admin', 'Batch Deleted', `Deleted batch ${batch.batchName}`);
    return res.json({ message: 'Batch deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
