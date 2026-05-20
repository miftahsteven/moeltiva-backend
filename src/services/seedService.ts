import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase() {
  const logs: string[] = [];

  try {
    // 1. Create Default User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@moeltiva.id' },
      update: {},
      create: {
        email: 'admin@moeltiva.id',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    logs.push('Default user created.');

    // 2. Profile Data
    await prisma.profile.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        companyName: 'Moeltiva',
        companyDesc: 'Moeltiva adalah brand kesehatan premium yang menghadirkan kebaikan alam dalam setiap sachetnya.',
        founderName: 'Moeltiva Founder',
        founderDesc: 'Berkomitmen untuk gaya hidup sehat masyarakat Indonesia.',
        phone: '+628123456789',
        whatsapp: '628123456789',
        address: 'Jakarta, Indonesia',
        email: 'hello@moeltiva.id',
        instagramUrl: 'https://instagram.com/moeltiva',
        tiktokUrl: 'https://tiktok.com/@moeltiva',
      },
    });
    logs.push('Profile data created.');

    // 3. Hero Data
    await prisma.hero.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        title: 'Moeltiva Easy healthy, Glow Naturally.',
        subtitle: 'Daily fruit juice made from real fruit, enriched with fiber, collagen, vitamin C, & zinc',
        description: 'Daily fruit juice made from real fruit, enriched with fiber, collagen, vitamin C, & zinc',
        imageUrl: '/moeltiva-images/hero1.JPG',
        hashtags: ['Avocado fruit extract', 'Collagen', 'Fiber', 'Vitamin C', 'Zinc'],
        headerCta: '🌿 100% Real Fruit',
        buttonCta: 'Pelajari Lebih Lanjut',
        buyButtonCta: '🛒 Beli Sekarang',
        buyButtonLink: '#order',
        buyButtonBg: '#F6DC43',
        buyButtonTextColor: '#215737',
      },
    });
    logs.push('Hero data created.');

    // 4. Ingredient Data
    const ingredientSection = await prisma.ingredientSection.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        title: 'Premium Ingredients from Nature',
        subtitle: 'Setiap sachet Moeltiva mengandung nutrisi pilihan yang bekerja sinergis untuk kesehatan optimalmu.',
      },
    });
    logs.push('Ingredient section created.');

    const ingredients = [
      { icon: '🧡', name: 'Avocado fruit extract', description: 'Terbuat dari ekstrak alpukat pilihan' },
      { icon: '🌾', name: 'Fish Collagen', description: 'Membantu menjaga kesehatan kulit' },
      { icon: '🛡️', name: 'Spinach Extract', description: 'Ekstrak bayam yang baik untuk tubuh' },
      { icon: '💚', name: 'High Fiber', description: 'Mengandung serat alami' },
      { icon: '⚡', name: 'With Stevia', description: 'Cocok untuk penderita diabetes' },
      { icon: '🥑', name: 'With Vitamin', description: 'Vitamin C, vitamin B kompleks, vitamin D, and Zinc' },
    ];

    for (const item of ingredients) {
      await prisma.ingredientItem.create({
        data: { ...item, link: '#' },
      });
    }
    logs.push(`${ingredients.length} ingredient items created.`);

    // 5. Benefit Data
    await prisma.benefitSection.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        title: 'Kenapa Pilih Moeltiva?',
        subtitle: 'Lebih dari sekadar minuman — Moeltiva adalah komitmen untuk gaya hidupmu yang lebih sehat.',
        ctaText: '🥑 Coba Moeltiva Sekarang',
        ctaLink: '#order',
      },
    });
    logs.push('Benefit section created.');

    const benefits = [
      { icon: '🌾', title: 'Tinggi Serat', description: 'Membantu rasa kenyang lebih lama dan menjaga kesehatan pencernaan.' },
      { icon: '🌱', title: '+1000 mg kolagen', description: 'Memberikan manfaat tambahan untuk kesehatan kulit dan jaringan tubuh.' },
      { icon: '⚡', title: 'Vitamin C, B, D, dan Zinc', description: 'Mendukung daya tahan tubuh dan metabolisme harian.' },
    ];

    for (const item of benefits) {
      await prisma.benefitItem.create({ data: item });
    }
    logs.push(`${benefits.length} benefit items created.`);

    return { success: true, logs };
  } catch (error: any) {
    console.error('Seeding error:', error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}
