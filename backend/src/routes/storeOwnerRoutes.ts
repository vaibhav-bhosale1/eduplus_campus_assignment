// backend/src/routes/storeOwnerRoutes.ts
import { Router } from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware';
import { getStoreOwnerDashboard } from '../controllers/storeOwnerController';
import { Role } from '@prisma/client';

const router = Router();

router.get('/dashboard', protect, authorizeRoles(Role.STORE_OWNER), getStoreOwnerDashboard);

export default router;