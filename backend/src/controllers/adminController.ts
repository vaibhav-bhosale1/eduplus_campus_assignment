// backend/src/controllers/adminController.ts
import { Request, Response } from 'express';
import { prisma } from '../server';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

// Dashboard Data
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.status(200).json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add New User (Admin, Normal, Store Owner)
export const addNewUser = async (req: Request, res: Response) => {
  const { name, email, password, address, role } = req.body;

  // Basic validation (more comprehensive validation in authController)
  if (!name || !email || !password || !address || !role) {
    return res.status(400).json({ message: 'Please provide all user details including role' });
  }
  if (!Object.values(Role).includes(role)) {
      return res.status(400).json({ message: 'Invalid user role provided.' });
  }
  if (name.length < 20 || name.length > 60) {
    return res.status(400).json({ message: 'Name must be between 20 and 60 characters' });
  }
  if (address.length > 400) {
    return res.status(400).json({ message: 'Address must be at most 400 characters' });
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be 8-16 characters long, include at least one uppercase letter and one special character'
    });
  }


  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add New Store
export const addNewStore = async (req: Request, res: Response) => {
  const { name, email, address, ownerId } = req.body;

  if (!name || !email || !address) {
    return res.status(400).json({ message: 'Please provide all store details' });
  }

  try {
    const storeExists = await prisma.store.findUnique({ where: { email } });
    if (storeExists) {
      return res.status(400).json({ message: 'Store with this email already exists' });
    }
    const storeNameExists = await prisma.store.findUnique({ where: { name } });
    if (storeNameExists) {
      return res.status(400).json({ message: 'Store with this name already exists' });
    }

    let owner = null;
    if (ownerId) {
        owner = await prisma.user.findUnique({ where: { id: ownerId, role: Role.STORE_OWNER } });
        if (!owner) {
            return res.status(400).json({ message: 'Provided owner ID is not a valid Store Owner.' });
        }
    }

    const newStore = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId: owner?.id,
      },
    });

    res.status(201).json(newStore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Stores with Rating (Admin View)
export const getAllStoresAdmin = async (req: Request, res: Response) => {
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
      orderBy.name = 'asc'; // Default sort
    }

    const stores = await prisma.store.findMany({
      where: whereClause,
      include: {
        ratings: {
          select: { value: true }
        }
      },
      orderBy: orderBy,
    });

    const storesWithAvgRating = stores.map(store => {
      const totalRating = store.ratings.reduce((sum, rating) => sum + rating.value, 0);
      const averageRating = store.ratings.length > 0 ? (totalRating / store.ratings.length).toFixed(2) : 'N/A';
      return {
        ...store,
        averageRating: averageRating,
        ratings: undefined, // Remove individual ratings from the response
      };
    });

    res.status(200).json(storesWithAvgRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Users (Normal and Admin) with filters
export const getAllUsersAdmin = async (req: Request, res: Response) => {
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
      orderBy.name = 'asc'; // Default sort
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        stores: { // Include stores if the user is a Store Owner
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: orderBy,
    });

    // If the user is a Store Owner, their store's average rating should also be displayed.
    // This requires an additional query or a more complex Prisma aggregate.
    // For simplicity here, we'll fetch ratings for Store Owners' stores separately.
    const usersWithStoreRatings = await Promise.all(users.map(async user => {
        if (user.role === Role.STORE_OWNER && user.stores && user.stores.length > 0) {
            const storeRatings = await prisma.rating.findMany({
                where: { storeId: user.stores[0].id }, // Assuming one store per owner for simplicity
                select: { value: true }
            });
            const totalRating = storeRatings.reduce((sum, rating) => sum + rating.value, 0);
            const averageRating = storeRatings.length > 0 ? parseFloat((totalRating / storeRatings.length).toFixed(2)) : null;
            return {
                ...user,
                storeAverageRating: averageRating,
            };
        }
        return user;
    }));

    res.status(200).json(usersWithStoreRatings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};