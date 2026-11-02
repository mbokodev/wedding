import { wedding } from "@/config/wedding";

/** Le domaine canonique reste identique, y compris sur les previews Vercel. */
export const siteUrl = new URL(wedding.meta.siteUrl).origin;
export const isPreview = Boolean(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production");
export const socialImage = {
  url: "/images/partage-mariage.png",
  width: 1200,
  height: 630,
  alt: "Mariage Ange & Cédric — 26 décembre 2026 à Douala, Cameroun. Unis par l’amour, guidés par Dieu.",
};
