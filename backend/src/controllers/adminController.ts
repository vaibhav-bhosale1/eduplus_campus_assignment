// backend/src/controllers/adminController.ts
import { Request, Response } from 'express';
import { prisma } from '../server';
import bcrypt from 'bcryptjs';
import { Role, User } from '../../generated/prisma';

type StoreWithRatings = Awaited<ReturnType<typeof prisma.store.findMany>>[number];
type UserWithStores = Awaited<ReturnType<typeof prisma.user.findMany>>[number];

// ----------------- Dashboard Stats -----------------
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.status(200).json({ totalUsers, totalStores, totalRatings });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

// ----------------- Add New User -----------------
export const addNewUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !address || !role) {
    res.status(400).json({ message: 'Please provide all user details including role' });
    return;
  }

  if (!Object.values(Role).includes(role)) {
    res.status(400).json({ message: 'Invalid user role provided.' });
    return;
  }

  if (name.length < 20 || name.length > 60) {
    res.status(400).json({ message: 'Name must be between 20 and 60 characters' });
    return;
  }

  if (address.length > 400) {
    res.status(400).json({ message: 'Address must be at most 400 characters' });
    return;
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message: 'Password must be 8–16 chars, include 1 uppercase & 1 special character'
    });
    return;
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: role as Role,
      },
    });

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

// ----------------- Add New Store -----------------
export const addNewStore = async (req: Request, res: Response): Promise<void> => {
  const { name, email, address, ownerId } = req.body;

  if (!name || !email || !address) {
    res.status(400).json({ message: 'Please provide all store details' });
    return;
  }

  try {
    const storeExists = await prisma.store.findUnique({ where: { email } });
    if (storeExists) {
      res.status(400).json({ message: 'Store with this email already exists' });
      return;
    }

    const storeNameExists = await prisma.store.findUnique({ where: { name } });
    if (storeNameExists) {
      res.status(400).json({ message: 'Store with this name already exists' });
      return;
    }

    let owner: User | null = null;
    if (ownerId) {
      owner = await prisma.user.findUnique({
        where: { id: ownerId, role: Role.STORE_OWNER }
      });
      if (!owner) {
        res.status(400).json({ message: 'Provided owner ID is not a valid Store Owner.' });
        return;
      }
    }

    const newStore = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId: owner?.id,
      },
      include: { // Include owner to return it in the response for immediate confirmation
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(newStore);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

// ----------------- Get All Stores (Admin View) -----------------

export const getAllStoresAdmin = async (req: Request, res: Response): Promise<void> => {
  const { name, email, address, sortField, sortOrder } = req.query;

  try {
    const whereClause: any = {};
    if (name) whereClause.name = { contains: name, mode: 'insensitive' };
    if (email) whereClause.email = { contains: email, mode: 'insensitive' };
    if (address) whereClause.address = { contains: address, mode: 'insensitive' };

    const orderBy: any = {};
    if (sortField && ['name', 'email', 'address'].includes(sortField as string)) {
      orderBy[sortField as string] = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.name = 'asc';
    }
        type StoreWithRatings = {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  ratings: { value: number }[];
};

  const stores: StoreWithRatings[] = await prisma.store.findMany({
        where: whereClause,
      include: {
        ratings: {
          select: { value: true }
        },
        owner: { // <-- CRITICAL: Include the owner relation here
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: orderBy,
    });

      console.log('DEBUG: Raw stores fetched for admin (including owner):', JSON.stringify(stores, null, 2));


    

  const storesWithAvgRating = stores.map(store => {
  const totalRating = store.ratings.reduce((sum, r) => sum + r.value, 0);
  const averageRating = store.ratings.length > 0 ? (totalRating / store.ratings.length).toFixed(2) : 'N/A';

  return {
    ...store,
    averageRating,
    ratings: undefined,
  };
});

    res.status(200).json(storesWithAvgRating);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

// ----------------- Get All Users (Admin View) -----------------
export const getAllUsersAdmin = async (req: Request, res: Response): Promise<void> => {
  const { name, email, address, role, sortField, sortOrder } = req.query;

  try {
    const whereClause: any = {};
    if (name) whereClause.name = { contains: name, mode: 'insensitive' };
    if (email) whereClause.email = { contains: email, mode: 'insensitive' };
    if (address) whereClause.address = { contains: address, mode: 'insensitive' };
    if (role && Object.values(Role).includes(role as Role)) whereClause.role = role;

    const orderBy: any = {};
    if (sortField && ['name', 'email', 'address', 'role'].includes(sortField as string)) {
      orderBy[sortField as string] = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.name = 'asc';
    }
type UserWithStores = {
  id: string;
  name: string;
  email: string;
  address: string | null;
  role: Role;
  stores: { id: string; name: string }[];
};

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        stores: { select: { id: true, name: true } }
      },
      orderBy,
    });

    const usersWithStoreRatings = await Promise.all(users.map(async (user: UserWithStores) => {
      if (user.role === Role.STORE_OWNER && user.stores.length > 0) {
        const storeRatings = await prisma.rating.findMany({
          where: { storeId: user.stores[0].id },
          select: { value: true },
        });
        const total = storeRatings.reduce((sum: number, r: { value: number }) => sum + r.value, 0);
        const avg = storeRatings.length > 0 ? parseFloat((total / storeRatings.length).toFixed(2)) : null;

        return { ...user, storeAverageRating: avg };
      }
      return user;
    }));

    res.status(200).json(usersWithStoreRatings);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

export const getAllRatingsAdmin = async (req: Request, res: Response) => {
  try {
    const ratings = await prisma.rating.findMany({
      include: {
        user: { // Include the user who submitted the rating
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        store: { // Include the store that was rated
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Order by most recent ratings first
      },
    });

    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error in getAllRatingsAdmin:', error);
    res.status(500).json({ message: 'Server error fetching ratings for admin.' });
  }
};