import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Generate JWT token
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
  );
};

// Register new user
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { 
      email, 
      password, 
      name, 
      nationality, 
      languagePreference, 
      ageGroup, 
      phoneNumber 
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError(400, 'User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        nationality,
        languagePreference,
        ageGroup,
        phoneNumber
      },
      select: {
        id: true,
        email: true,
        name: true,
        nationality: true,
        languagePreference: true,
        ageGroup: true,
        phoneNumber: true
      }
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          nationality: user.nationality,
          languagePreference: user.languagePreference,
          ageGroup: user.ageGroup,
          phoneNumber: user.phoneNumber
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: {
        id: true,
        email: true,
        name: true,
        nationality: true,
        languagePreference: true,
        ageGroup: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, nationality, languagePreference, ageGroup, phoneNumber } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(nationality && { nationality }),
        ...(languagePreference && { languagePreference }),
        ...(ageGroup && { ageGroup }),
        ...(phoneNumber && { phoneNumber })
      },
      select: {
        id: true,
        email: true,
        name: true,
        nationality: true,
        languagePreference: true,
        ageGroup: true,
        phoneNumber: true,
        updatedAt: true
      }
    });

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};