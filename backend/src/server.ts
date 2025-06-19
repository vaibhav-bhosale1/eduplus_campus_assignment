
import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma';
import cors from 'cors';


import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes'; 
import ratingRoutes from './routes/ratingRoutes';
import storeOwnerRoutes from './routes/storeOwnerRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);      
app.use('/api/users', userRoutes);       
app.use('/api/ratings', ratingRoutes);   
app.use('/api/owner', storeOwnerRoutes); 

app.get('/', (req, res) => {
  res.send('Store Rating API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


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
