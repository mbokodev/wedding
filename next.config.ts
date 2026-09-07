import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Build autonome pour Docker : copie le serveur + node_modules minimal dans .next/standalone */
  output: "standalone",
};

export default nextConfig;
