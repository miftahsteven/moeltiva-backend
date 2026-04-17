import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProductSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.productSection.findUnique({ where: { id: 1 } });
    const stats = await prisma.productStat.findMany({ orderBy: { order: 'asc' } });
    res.json({ ...section, stats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product data', error });
  }
};

export const updateProductSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.productSection.upsert({
      where: { id: 1 },
      update: req.body,
      create: { ...req.body, id: 1 },
    });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product section', error });
  }
};

export const upsertProductStat = async (req: Request, res: Response) => {
  const { id, ...data } = req.body;
  try {
    const stat = id 
      ? await prisma.productStat.update({ where: { id }, data })
      : await prisma.productStat.create({ data });
    res.json(stat);
  } catch (error) {
    res.status(500).json({ message: 'Error saving product stat', error });
  }
};

export const deleteProductStat = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).json({ message: 'Invalid ID' });
    await prisma.productStat.delete({ where: { id: parseInt(id as string) } });
    res.json({ message: 'Stat deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product stat', error });
  }
};
