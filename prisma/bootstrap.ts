import "dotenv/config";
import { hashSync } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../src/generated/prisma/client";

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  const email = process.env.SEED_SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD;
  if (!connectionString || !email || !password || password.length < 12 || password === "changez-moi") {
    throw new Error("Configurez DATABASE_URL, SEED_SUPER_ADMIN_EMAIL et un SEED_SUPER_ADMIN_PASSWORD unique d’au moins 12 caractères.");
  }

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    await db.$transaction(async (tx) => {
      const existing = await tx.user.findUnique({ where: { email } });
      if (existing && existing.role !== Role.SUPER_ADMIN) {
        throw new Error("Cet email appartient déjà à un autre rôle. Choisissez l’email du super administrateur.");
      }
      await tx.user.upsert({
        where: { email },
        update: {},
        create: { email, fullName: "Cédric", role: Role.SUPER_ADMIN, passwordHash: hashSync(password, 12), quota: null },
      });
      await tx.weddingSettings.upsert({
        where: { id: 1 }, update: {}, create: { id: 1, totalGuestCapacity: 500 },
      });
    });
    console.log("Initialisation terminée : administrateur et paramètres disponibles. Aucune donnée existante modifiée.");
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
