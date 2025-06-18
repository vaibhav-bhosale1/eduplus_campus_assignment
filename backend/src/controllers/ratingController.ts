// backend/src/controllers/ratingController.ts
import { Request, Response } from 'express';
import { prisma } from '../server';

// Submit a rating
export const submitRating = async (req: Request, res: Response) => {
  const { storeId, value } = req.body;
  const userId = req.user?.id;

  if (!userId || !storeId || !value) {
    return res.status(400).json({ message: 'Please provide store ID and rating value' });
  }
  if (value < 1 || value > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already submitted a rating for this store. Please modify it instead.' });
    }

    const newRating = await prisma.rating.create({
      data: {
        userId,
        storeId,
        value,
      },
    });

    res.status(201).json(newRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Modify a submitted rating
export const modifyRating = async (req: Request, res: Response) => {
  const { storeId, value } = req.body;
  const userId = req.user?.id;

  if (!userId || !storeId || !value) {
    return res.status(400).json({ message: 'Please provide store ID and new rating value' });
  }
  if (value < 1 || value > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const updatedRating = await prisma.rating.update({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      data: {
        value,
      },
    });

    res.status(200).json(updatedRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Make sure you have previously rated this store.' });
  }
};