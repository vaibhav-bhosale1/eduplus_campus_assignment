// backend/src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma';
import cors from 'cors';

// CORRECTED IMPORTS: Ensuring only necessary route modules are imported.
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes'; // Correctly imports userRoutes.ts
import ratingRoutes from './routes/ratingRoutes';
import storeOwnerRoutes from './routes/storeOwnerRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// CORRECTED ROUTES MOUNTING: Ensure each API path uses the correct router.
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);      // Handles Admin-specific store and user management
app.use('/api/users', userRoutes);       // Handles Normal User-specific store browsing
app.use('/api/ratings', ratingRoutes);   // Handles Normal User rating submissions/modifications
app.use('/api/owner', storeOwnerRoutes); // Handles Store Owner dashboard

// REMOVED: Redundant or unneeded '/api/stores' mounting with a separate storeRoutes module
// If your 'backend/src/routes/storeRoutes.ts' existed and had unique, non-role-specific API endpoints,
// you would keep it. However, based on our discussion, admin and user store listings are already handled.

app.get('/', (req, res) => {
  res.send('Store Rating API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Extend the Express Request interface for TypeScript
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
      };
    }
  }
}

export { prisma };
