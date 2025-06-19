
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma'; 

const prisma = new PrismaClient();

interface DecodedToken {
  id: string;
  role: 'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
      };
    }
  }
}

export const protect: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, role: true },
      });

      if (!user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      req.user = user;
       console.log('DEBUG (Protect): Token Decoded User ID:', decoded.id);
      console.log('DEBUG (Protect): User fetched from DB for token:', req.user);
      next(); 
      return;
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  res.status(401).json({ message: 'Not authorized, no token' });
  return;
};
export const authorizeRoles = (...roles: Array<'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER'>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
     console.log('DEBUG (AuthorizeRoles): Checking roles...');
    console.log('DEBUG (AuthorizeRoles): Required roles:', roles);
    console.log('DEBUG (AuthorizeRoles): User role from req.user:', req.user?.role);
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: 'Forbidden: You do not have permission to perform this action',
      });
      return;
    }
   console.log('DEBUG (AuthorizeRoles): Access GRANTED for user role:', req.user.role);
    next(); 
  };
};
