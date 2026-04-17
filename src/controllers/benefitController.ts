import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBenefitSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.benefitSection.findUnique({ where: { id: 1 } });
    const items = await prisma.benefitItem.findMany({ orderBy: { order: 'asc' } });
    res.json({ ...section, items });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching benefits', error });
  }
};

export const updateBenefitSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.benefitSection.upsert({
      where: { id: 1 },
      update: req.body,
      create: { ...req.body, id: 1 },
    });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error updating benefit section', error });
  }
};

export const upsertBenefitItem = async (req: Request, res: Response) => {
  const { id, ...data } = req.body;
  try {
    const item = id 
      ? await prisma.benefitItem.update({ where: { id }, data })
      : await prisma.benefitItem.create({ data });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error saving benefit item', error });
  }
};

export const deleteBenefitItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).json({ message: 'Invalid ID' });
    await prisma.benefitItem.delete({ where: { id: parseInt(id as string) } });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting benefit item', error });
  }
};
