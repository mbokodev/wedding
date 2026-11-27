import { wedding } from "@/config/wedding";

/** Le domaine canonique reste identique, y compris sur les previews Vercel. */
export const siteUrl = "https://angedecedric.com";
export const siteName = wedding.meta.title;
export const isPreview = Boolean(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production");
export const socialImage = {
  url: "/images/partage-mariage.png",
  width: 1200,
  height: 630,
  alt: "Mariage Ange & Cédric — 26 décembre 2026 à Douala, Cameroun. Unis par l’amour, guidés par Dieu.",
};

/** Décrit la page publique sans exposer les billets nominatifs ni les horaires masqués. */
export const publicSiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: siteName,
      alternateName: ["Ange & Cédric", "Mariage Ange et Cédric"],
      description: wedding.meta.description,
      inLanguage: "fr",
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: `${siteUrl}/`,
      name: siteName,
      description: wedding.meta.description,
      inLanguage: "fr",
      isPartOf: { "@id": `${siteUrl}/#website` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: new URL(socialImage.url, siteUrl).href,
        width: socialImage.width,
        height: socialImage.height,
        caption: socialImage.alt,
      },
    },
  ],
};
