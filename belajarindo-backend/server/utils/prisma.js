import { PrismaClient } from '@prisma/client';

export const prisma = global.__prisma || new PrismaClient();
if (!global.__prisma) global.__prisma = prisma;
