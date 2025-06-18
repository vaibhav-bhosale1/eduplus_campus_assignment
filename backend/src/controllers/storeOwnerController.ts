// backend/src/controllers/storeOwnerController.ts
import { Request, Response } from 'express';
import { prisma } from '../server';
import { Role } from '@prisma/client';

// Get Store Owner's Dashboard Data
export const getStoreOwnerDashboard = async (req: Request, res: Response) => {
  const ownerId = req.user?.id;

  if (!ownerId) {
    return res.status(400).json({ message: 'Owner ID not found in token' });
  }

  try {
    const ownerStore = await prisma.store.findFirst({
      where: { ownerId: ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      },
    });

    if (!ownerStore) {
      return res.status(404).json({ message: 'No store found for this owner.' });
    }

    const totalRating = ownerStore.ratings.reduce((sum, rating) => sum + rating.value, 0);
    const averageRating = ownerStore.ratings.length > 0 ? parseFloat((totalRating / ownerStore.ratings.length).toFixed(2)) : 0;

    const usersWhoRated = ownerStore.ratings.map(rating => ({
      userId: rating.user.id,
      userName: rating.user.name,
      userEmail: rating.user.email,
      ratingValue: rating.value,
    }));

    res.status(200).json({
      storeId: ownerStore.id,
      storeName: ownerStore.name,
      averageRating: averageRating,
      usersWhoRated: usersWhoRated,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};