import prisma from './client.js';

export const initDb = async () => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('Connected to PostgreSQL via Prisma');
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
    throw error;
  }
};
