// backend/src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma';
import authRoutes from '../src/routes/authRoutes';
import userRoutes from '../src/routes/adminRoutes';
import storeRoutes from '../src/routes/storeOwnerRoutes';
import ratingRoutes from '../src/routes/ratingRoutes';
import adminRoutes from '../src/routes/adminRoutes'
import storeOwnerRoutes from '../src/routes/storeOwnerRoutes'
import cors from 'cors';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/owner', storeOwnerRoutes);


app.get('/', (req, res) => {
  res.send('Store Rating API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Make prisma client accessible globally (optional, but convenient for controllers)
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