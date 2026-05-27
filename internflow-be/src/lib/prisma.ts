import { PrismaClient } from '@prisma/client';

// Singleton pattern: đảm bảo chỉ có 1 instance PrismaClient trong toàn app
// Tránh tạo nhiều connection pool khi ts-node-dev hot reload
//Singleton Pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
