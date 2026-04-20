import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import heroRoutes from './routes/hero.js';
import ingredientRoutes from './routes/ingredient.js';
import benefitRoutes from './routes/benefit.js';
import productRoutes from './routes/product.js';
import faqRoutes from './routes/faq.js';
import findUsRoutes from './routes/findUs.js';
import footerRoutes from './routes/footer.js';
import analyticsRoutes from './routes/analytics.js';
import uploadRoutes from './routes/upload.js';
import { seedDatabase } from './services/seedService.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

// Verify ENV loading
console.log('--- Backend Environment Check ---');
console.log('JWT_SECRET status:', process.env.JWT_SECRET ? '✅ LOADED' : '❌ NOT LOADED (using fallback)');
console.log('---------------------------------');

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

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
