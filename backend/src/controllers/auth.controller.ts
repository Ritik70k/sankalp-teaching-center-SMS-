import { Request, Response } from 'express';
import prisma from '../services/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { getJwtSecret } from '../middleware/auth.middleware';

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      getJwtSecret(),
      { expiresIn: '24h' }
    );

    return res.json({ token, username: user.username, role: user.role });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function me(req: any, res: Response) {
  return res.json({ user: req.user });
}
