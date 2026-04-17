import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifySync, generateSecret, generateURI } from 'otplib';
import * as qrcode from 'qrcode';
import { PrismaClient } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const login = async (req: Request, res: Response) => {
  const { email, password, token } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // MFA Check
    if (user.mfaEnabled) {
      if (!token) {
        return res.status(200).json({ mfaRequired: true, message: 'MFA token required' });
      }
      const isValid = verifySync({ 
        token, 
        secret: user.totpSecret || '' 
      });
      if (!isValid) return res.status(401).json({ message: 'Invalid MFA token' });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // If MFA is not enabled but required for all users (global policy)
    // We send a success but with a flag that setup is needed
    res.json({ 
      accessToken, 
      user: { id: user.id, email: user.email, role: user.role, mfaEnabled: user.mfaEnabled },
      mfaSetupRequired: !user.mfaEnabled 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const setupMFA = async (req: any, res: Response) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const secret = generateSecret();
    const otpauth = generateURI({ 
      label: user.email, 
      issuer: 'Moeltiva Admin', 
      secret 
    });
    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    await prisma.user.update({
      where: { id: userId },
      data: { totpSecret: secret }
    });

    res.json({ qrCodeUrl, secret });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const verifyMFA = async (req: any, res: Response) => {
  const { token } = req.body;
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.totpSecret) return res.status(400).json({ message: 'MFA not setup' });

    const isValid = verifySync({ 
      token, 
      secret: user.totpSecret 
    });
    if (!isValid) return res.status(400).json({ message: 'Invalid token' });

    await prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true }
    });

    res.json({ message: 'MFA enabled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// User Management CRUD
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        mfaEnabled: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  const { email, password, role } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'VIEWER',
      },
      select: {
        id: true,
        email: true,
        role: true,
      }
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    if (!id) return res.status(400).json({ message: 'Invalid ID' });
    const user = await prisma.user.update({
      where: { id: parseInt(id as string) },
      data: { role },
      select: { id: true, email: true, role: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).json({ message: 'Invalid ID' });
    // Prevent self-deletion if needed, or just allow it with warning
    if (req.user?.id === parseInt(id as string)) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await prisma.user.delete({ where: { id: parseInt(id as string) } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error });
  }
};

export const resetUserMFA = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).json({ message: 'Invalid ID' });
    await prisma.user.update({
      where: { id: parseInt(id as string) },
      data: {
        totpSecret: null,
        mfaEnabled: false
      }
    });
    res.json({ message: 'User MFA has been reset' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset MFA', error });
  }
};
