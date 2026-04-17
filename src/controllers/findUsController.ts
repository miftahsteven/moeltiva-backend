import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFindUsSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.whereToFindSection.findUnique({ where: { id: 1 } });
    const platforms = await prisma.platformItem.findMany({ orderBy: { order: 'asc' } });
    res.json({ ...section, platforms });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching find us data', error });
  }
};

export const updateFindUsSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.whereToFindSection.upsert({
      where: { id: 1 },
      update: req.body,
      create: { ...req.body, id: 1 },
    });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error updating find us section', error });
  }
};

export const upsertPlatformItem = async (req: Request, res: Response) => {
  const { id, ...data } = req.body;
  try {
    const item = id 
      ? await prisma.platformItem.update({ where: { id }, data })
      : await prisma.platformItem.create({ data });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error saving platform item', error });
  }
};

export const deletePlatformItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).json({ message: 'Invalid ID' });
    await prisma.platformItem.delete({ where: { id: parseInt(id as string) } });
    res.json({ message: 'Platform item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting platform item', error });
  }
};
