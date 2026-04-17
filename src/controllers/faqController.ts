import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFaqSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.upgradeFAQSection.findUnique({ where: { id: 1 } });
    const upgrades = await prisma.upgradeItem.findMany({ orderBy: { order: 'asc' } });
    const faqs = await prisma.fAQItem.findMany({ orderBy: { order: 'asc' } });
    res.json({ ...section, upgrades, faqs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQ data', error });
  }
};

export const updateFaqSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.upgradeFAQSection.upsert({
      where: { id: 1 },
      update: req.body,
      create: { ...req.body, id: 1 },
    });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error updating FAQ section', error });
  }
};

export const upsertUpgradeItem = async (req: Request, res: Response) => {
  const { id, ...data } = req.body;
  try {
    const item = id 
      ? await prisma.upgradeItem.update({ where: { id }, data })
      : await prisma.upgradeItem.create({ data });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error saving upgrade item', error });
  }
};

export const deleteUpgradeItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).json({ message: 'Invalid ID' });
    await prisma.upgradeItem.delete({ where: { id: parseInt(id as string) } });
    res.json({ message: 'Upgrade item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting upgrade item', error });
  }
};

export const upsertFaqItem = async (req: Request, res: Response) => {
  const { id, ...data } = req.body;
  try {
    const item = id 
      ? await prisma.fAQItem.update({ where: { id }, data })
      : await prisma.fAQItem.create({ data });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error saving FAQ item', error });
  }
};

export const deleteFaqItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).json({ message: 'Invalid ID' });
    await prisma.fAQItem.delete({ where: { id: parseInt(id as string) } });
    res.json({ message: 'FAQ item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting FAQ item', error });
  }
};
