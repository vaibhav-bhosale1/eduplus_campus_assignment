// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role, User } from '../../generated/prisma'; // Use Prisma enum

const prisma = new PrismaClient();

// Custom decoded token interface
interface DecodedToken {
  id: string;
  role: Role;
  iat: number;
  exp: number;
}

// 🛡️ Middleware: Protect route using JWT
export const protect: RequestHandler = async (req, res, next) => {
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
      next(); // ✅ no need to return next()
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
export const authorizeRoles = (...roles: Role[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: 'Forbidden: You do not have permission to perform this action',
      });
      return;
    }

    next(); // no return needed for next()
  };
};
