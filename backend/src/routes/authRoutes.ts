// backend/src/routes/authRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser, updatePassword } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update-password', protect, updatePassword);

export default router;