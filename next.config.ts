import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Build autonome pour Docker : copie le serveur + node_modules minimal dans .next/standalone */
  output: process.env.VERCEL ? undefined : "standalone",
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }];
    if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
      return [{ source: "/:path*", headers: noindex }];
    }
    return ["/admin/:path*", "/check-in/:path*", "/login", "/invitation/:path*", "/api/:path*"].map(source => ({ source, headers: noindex }));
  },
};

export default nextConfig;
