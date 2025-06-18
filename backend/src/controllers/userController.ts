// backend/src/controllers/userController.ts
import { Request, Response } from 'express';
import { prisma } from '../server';
import { Role } from '@prisma/client';

// Get All Stores for Normal User (with user's rating if exists)
export const getStoresForNormalUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { name, address, sortField, sortOrder } = req.query;

  try {
    const whereClause: any = {};
    if (name) whereClause.name = { contains: name, mode: 'insensitive' };
    if (address) whereClause.address = { contains: address, mode: 'insensitive' };

    const orderBy: any = {};
    if (sortField && ['name', 'address'].includes(sortField as string)) {
      orderBy[sortField as string] = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.name = 'asc'; // Default sort
    }

    const stores = await prisma.store.findMany({
      where: whereClause,
      include: {
        ratings: {
          select: {
            value: true,
            userId: true,
          }
        }
      },
      orderBy: orderBy,
    });

    const storesWithRatings = stores.map(store => {
      const totalRating = store.ratings.reduce((sum, rating) => sum + rating.value, 0);
      const averageRating = store.ratings.length > 0 ? parseFloat((totalRating / store.ratings.length).toFixed(2)) : null;
      const userSubmittedRating = store.ratings.find(rating => rating.userId === userId)?.value || null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: averageRating,
        userSubmittedRating: userSubmittedRating,
      };
    });

    res.status(200).json(storesWithRatings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};