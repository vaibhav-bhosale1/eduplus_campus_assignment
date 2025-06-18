// backend/src/types/express/index.d.ts
import { Role } from '../../../generated/prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }
  }
}
