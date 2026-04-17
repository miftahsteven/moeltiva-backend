import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getHero = async (req: Request, res: Response) => {
  try {
    const hero = await prisma.hero.findUnique({ where: { id: 1 } });
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hero data', error });
  }
};

export const updateHero = async (req: Request, res: Response) => {
  try {
    const hero = await prisma.hero.upsert({
      where: { id: 1 },
      update: req.body,
      create: { ...req.body, id: 1 },
    });
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: 'Error updating hero data', error });
  }
};
