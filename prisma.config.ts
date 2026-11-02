import "dotenv/config"; // Prisma 7 ne charge plus .env automatiquement
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // generate n’utilise pas la base. Les commandes de migration exigent une URL.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
