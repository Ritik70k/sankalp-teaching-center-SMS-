import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "sankalp_teaching_center_super_secret_jwt_key_2026";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: string;
  };
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Token is invalid or expired' });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization token required' });
  }
}
