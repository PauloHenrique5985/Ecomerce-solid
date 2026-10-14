import { PrismaClient } from '@prisma/client';

// Instância única do PrismaClient, compartilhada pelos repositórios.
export const prisma = new PrismaClient();
