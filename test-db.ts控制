import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking database connection...');
    await prisma.$connect();
    console.log('Connected successfully!');

    const heroCount = await prisma.hero.count();
    console.log(`Hero records: ${heroCount}`);

    const userCount = await prisma.user.count();
    console.log(`User records: ${userCount}`);

    const profileCount = await prisma.profile.count();
    console.log(`Profile records: ${profileCount}`);

    if (heroCount === 0) {
      console.log('Warning: Hero table is empty!');
    }

  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
