import type { MetadataRoute } from "next";
import { isPreview, siteUrl } from "@/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Les chapitres sont des ancres de la page d’accueil, pas des pages distinctes.
  return isPreview ? [] : [{ url: siteUrl, priority: 1 }];
}
