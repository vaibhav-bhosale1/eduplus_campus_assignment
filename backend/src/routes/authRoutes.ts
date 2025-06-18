// backend/src/routes/authRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser, updatePassword } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware'; // Assuming protect middleware exists

const router = Router();

router.post('/register', registerUser); // Public registration route
router.post('/login', loginUser);       // Single login endpoint for all roles
router.put('/update-password', protect, updatePassword); // Protected route for updating password

export default router;
