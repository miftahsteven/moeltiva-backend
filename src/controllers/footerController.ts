import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFooter = async (req: Request, res: Response) => {
  try {
    const footer = await prisma.footer.findUnique({ where: { id: 1 } });
    res.json(footer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching footer data', error });
  }
};

export const updateFooter = async (req: Request, res: Response) => {
  try {
    const footer = await prisma.footer.upsert({
      where: { id: 1 },
      update: req.body,
      create: { ...req.body, id: 1 },
    });
    res.json(footer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating footer data', error });
  }
};
