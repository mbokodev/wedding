import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Singleton PrismaClient (Prisma 7, adapter pg).
 * En dev, l'instance est conservée sur globalThis pour survivre au HMR.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL n'est pas définie");
  }
  const adapter = new PrismaPg({
    connectionString,
    max: 5,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 10000,
  });
  return new PrismaClient({ adapter });
}

let client = globalForPrisma.prisma;

function getPrismaClient() {
  if (!client) {
    client = createPrismaClient();
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  }
  return client;
}

// Importer les routes privées pendant le build ne doit pas exiger de base.
// La vérification DATABASE_URL reste obligatoire dès la première utilisation.
export const db = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const prisma = getPrismaClient();
    const value = Reflect.get(prisma, property, prisma);
    return typeof value === "function" ? value.bind(prisma) : value;
  },
});
