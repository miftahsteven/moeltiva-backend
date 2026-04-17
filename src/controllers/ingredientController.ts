import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getIngredientSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.ingredientSection.findUnique({ where: { id: 1 } });
    const items = await prisma.ingredientItem.findMany({ orderBy: { order: 'asc' } });
    res.json({ ...section, items });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ingredients', error });
  }
};

export const updateIngredientSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.ingredientSection.upsert({
      where: { id: 1 },
      update: req.body,
      create: { ...req.body, id: 1 },
    });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error updating ingredient section', error });
  }
};

export const upsertIngredientItem = async (req: Request, res: Response) => {
  const { id, ...data } = req.body;
  try {
    const item = id 
      ? await prisma.ingredientItem.update({ where: { id }, data })
      : await prisma.ingredientItem.create({ data });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error saving ingredient item', error });
  }
};

export const deleteIngredientItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.ingredientItem.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ingredient item', error });
  }
};
