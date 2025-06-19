// backend/src/routes/userRoutes.ts
import { Router } from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware';
import { getStoresForNormalUser } from '../controllers/userController'; // Ensure this path is correct
import { Role } from '../../generated/prisma'; // Make sure this import is correct: '@prisma/client'

const router = Router();

// This route (for fetching stores for normal users) MUST allow NORMAL_USER role.
// It can also allow SYSTEM_ADMIN if you want admins to see the same list as normal users.
router.get(
  '/stores',
  protect,
  authorizeRoles(Role.NORMAL_USER, Role.SYSTEM_ADMIN), // <-- THIS IS THE CRITICAL LINE
  getStoresForNormalUser
);

export default router;
