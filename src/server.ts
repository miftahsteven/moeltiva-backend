import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import heroRoutes from './routes/hero';
import ingredientRoutes from './routes/ingredient';
import benefitRoutes from './routes/benefit';
import productRoutes from './routes/product';
import faqRoutes from './routes/faq';
import findUsRoutes from './routes/findUs';
import footerRoutes from './routes/footer';
import analyticsRoutes from './routes/analytics';
import uploadRoutes from './routes/upload';
import { seedDatabase } from './services/seedService';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Database Seed and Test Routes
app.get('/api/seed', async (req, res) => {
  try {
    const result = await seedDatabase();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/test-db', async (req, res) => {
  try {
    const heroCount = await prisma.hero.count();
    res.json({ success: true, message: 'Connected!', heroCount });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/benefits', benefitRoutes);
app.use('/api/products', productRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/find-us', findUsRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, prisma };
