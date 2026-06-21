import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || "sankalp_teaching_center_super_secret_jwt_key_2026";
  return secret.trim().replace(/^['"]|['"]$/g, '');
}

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: string;
  };
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  console.log('[JWT Debug] Authorization Header:', authHeader);
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const secret = getJwtSecret();
    console.log('[JWT Debug] Token extracted (first 15 chars):', token ? token.substring(0, 15) : 'null');
    console.log('[JWT Debug] Using JWT_SECRET (length):', secret ? secret.length : 0);
    
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        console.error('[JWT Debug] Verification Error:', err.message, err);
        return res.status(403).json({ error: 'Token is invalid or expired', details: err.message });
      }
      console.log('[JWT Debug] Verification Success. User:', decoded);
      req.user = decoded;
      next();
    });
  } else {
    console.warn('[JWT Debug] Missing or invalid Authorization header format');
    res.status(401).json({ error: 'Authorization token required' });
  }
}
