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
import { Role } from '../../generated/prisma';

const router = Router();
router.get('/test-admin', (req, res) => {
  res.send('Admin test route hit successfully!');
});

router.use(protect, authorizeRoles(Role.SYSTEM_ADMIN));

router.get('/dashboard-stats', getDashboardStats);
router.post('/users', addNewUser);
router.post('/stores', addNewStore);
router.get('/stores', getAllStoresAdmin);
router.get('/users', getAllUsersAdmin);

export default router;
