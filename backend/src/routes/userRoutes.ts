// backend/src/routes/userRoutes.ts
import { Router } from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware';
import { getStoresForNormalUser } from '../controllers/userController';
import { Role } from '../../generated/prisma'
const router = Router();

router.get('/stores', protect, authorizeRoles(Role.NORMAL_USER, Role.SYSTEM_ADMIN), getStoresForNormalUser);

export default router;