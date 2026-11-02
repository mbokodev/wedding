import type { MetadataRoute } from "next";
import { isPreview, siteUrl } from "@/config/seo";

export default function robots(): MetadataRoute.Robots {
  if (isPreview) return { rules: { userAgent: "*", disallow: "/" } };
  // Les pages privées restent explorables afin que leur noindex soit lu.
  // Leur accès est toujours contrôlé par les gardes d’authentification.
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${siteUrl}/sitemap.xml` };
}
