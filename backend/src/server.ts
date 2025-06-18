// backend/src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import storeRoutes from './routes/storeRoutes';
import ratingRoutes from './routes/ratingRoutes';
import cors from 'cors';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

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