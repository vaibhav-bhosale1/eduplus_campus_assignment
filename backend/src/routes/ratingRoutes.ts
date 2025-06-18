// backend/src/routes/ratingRoutes.ts
import { Router } from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware';
import { submitRating, modifyRating } from '../controllers/ratingController';
import { Role } from '../../generated/prisma';

const router = Router();

router.post('/', protect, authorizeRoles(Role.NORMAL_USER), submitRating);
router.put('/', protect, authorizeRoles(Role.NORMAL_USER), modifyRating);

export default router;