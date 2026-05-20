const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
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

  const benefits = [
    { icon: '🌾', title: 'Tinggi Serat', description: 'Membantu rasa kenyang lebih lama dan menjaga kesehatan pencernaan.' },
    { icon: '🌱', title: '+1000 mg kolagen', description: 'Memberikan manfaat tambahan untuk kesehatan kulit dan jaringan tubuh.' },
    { icon: '⚡', title: 'Vitamin C, B, D, dan Zinc', description: 'Mendukung daya tahan tubuh dan metabolisme harian.' },
  ];

  for (const item of benefits) {
    await prisma.benefitItem.create({ data: item });
  }

  // 6. Product Data
  await prisma.productSection.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'Kenalan dengan Moeltiva',
      subtitle: 'Kisah ketulusan dari kebun alpukat pilihan untuk kesehatan Anda.',
      imageUrl: '/moeltiva-images/farmer-avocado.png',
      quote: 'Di balik rasa Moeltiva, ada kisah petani yang menanam dengan cinta dan panen dengan harapan.',
      description: 'Setiap teguk adalah jembatan antara Anda dan mereka.',
    },
  });

  const stats = [
    { value: '10', unit: 'Sachet', label: 'per Box' },
    { value: '100%', unit: '', label: 'Real Avocado' },
    { value: '1rb+', unit: '', label: 'Petani Lokal' },
  ];

  for (const stat of stats) {
    await prisma.productStat.create({ data: stat });
  }

  // 7. FAQ Data
  await prisma.upgradeFAQSection.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'Frequently Asked Questions',
      subtitle: 'Punya pertanyaan seputar Moeltiva? Temukan jawabannya di sini.',
    },
  });

  const faqs = [
    { question: 'Apakah Moeltiva menggunakan gula tambahan?', answer: 'Moeltiva menggunakan Stevia, pemanis alami.' },
    { question: 'Apakah Moeltiva aman untuk penderita asam lambung?', answer: 'Ya, sangat aman.' },
  ];

  for (const faq of faqs) {
    await prisma.fAQItem.create({ data: faq });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
