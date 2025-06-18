// backend/src/controllers/storeOwnerController.ts
import { Request, Response } from 'express';
import { prisma } from '../server';


// Define the shape of store with related ratings and users


type StoreWithRatingsAndUsers = {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  ratings: {
    value: number;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
};


export const getStoreOwnerDashboard = async (req: Request, res: Response): Promise<void> => {
  const ownerId = req.user?.id;

  if (!ownerId) {
    res.status(400).json({ message: 'Owner ID not found in token' });
    return;
  }

  try {
    const ownerStore: StoreWithRatingsAndUsers = await prisma.store.findFirst({
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
    })  as StoreWithRatingsAndUsers;

    if (!ownerStore) {
      res.status(404).json({ message: 'No store found for this owner.' });
      return;
    }

    const totalRating = ownerStore.ratings.reduce(
      (sum: number, rating: { value: number }) => sum + rating.value,
      0
    );

    const averageRating =
      ownerStore.ratings.length > 0
        ? parseFloat((totalRating / ownerStore.ratings.length).toFixed(2))
        : 0;

    const usersWhoRated = ownerStore.ratings.map((rating) => ({
      userId: rating.user.id,
      userName: rating.user.name,
      userEmail: rating.user.email,
      ratingValue: rating.value,
    }));

    res.status(200).json({
      storeId: ownerStore.id,
      storeName: ownerStore.name,
      averageRating,
      usersWhoRated,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};
