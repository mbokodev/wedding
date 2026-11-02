import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Build autonome pour Docker : copie le serveur + node_modules minimal dans .next/standalone */
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
