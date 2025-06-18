// backend/src/routes/adminRoutes.ts
import { Router } from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware';
import {
  getDashboardStats,
  addNewUser,
  addNewStore,
  getAllStoresAdmin,
  getAllUsersAdmin,
} from '../controllers/adminController';
import { Role } from '@prisma/client';

const router = Router();

// All admin routes should be protected and only accessible by SYSTEM_ADMIN
router.use(protect, authorizeRoles(Role.SYSTEM_ADMIN));

router.get('/dashboard-stats', getDashboardStats);
router.post('/users', addNewUser);
router.post('/stores', addNewStore);
router.get('/stores', getAllStoresAdmin);
router.get('/users', getAllUsersAdmin);

export default router;