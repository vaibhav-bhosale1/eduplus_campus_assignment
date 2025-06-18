// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import { prisma } from '../server';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';
import { Role } from '../../generated/prisma'

// User Registration
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, address, role } = req.body;

  // Validation
  if (!name || !email || !password || !address) {
     res.status(400).json({ message: 'Please enter all fields' });
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
      message: 'Password must be 8-16 characters long, include at least one uppercase letter and one special character'
    });
    return;
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
       res.status(400).json({ message: 'User already exists' });
       return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: role || Role.NORMAL_USER, // Default to NORMAL_USER if not specified
      },
    });

    if (newUser) {
      res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role,
        token: generateToken(newUser.id, newUser.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
      
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    
  }
};

// User Login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Password
export const updatePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?.id;

  if (!userId || !oldPassword || !newPassword) {
     res.status(400).json({ message: 'Please provide old and new passwords' });
     return;
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
  if (!passwordRegex.test(newPassword)) {
     res.status(400).json({
      message: 'New password must be 8-16 characters long, include at least one uppercase letter and one special character'
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
       res.status(401).json({ message: 'Invalid old password' });
       return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: 'Password updated successfully' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    
  }
};