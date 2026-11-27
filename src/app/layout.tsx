import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { wedding } from "@/config/wedding";
import { isPreview, siteUrl, siteName, socialImage } from "@/config/seo";
import "./globals.css";

const cormorant = localFont({
  variable: "--font-cormorant",
  src: [
    { path: "./fonts/CormorantGaramond[wght].ttf", weight: "300 700", style: "normal" },
    { path: "./fonts/CormorantGaramond-Italic[wght].ttf", weight: "300 700", style: "italic" },
  ],
  display: "swap",
});

const jost = localFont({
  variable: "--font-jost",
  src: "./fonts/Jost[wght].ttf",
  weight: "100 900",
  display: "swap",
});

const pinyon = localFont({
  variable: "--font-pinyon",
  src: "./fonts/PinyonScript-Regular.ttf",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: wedding.meta.title,
    template: `%s — ${wedding.couple.displayName}`,
  },
  description: wedding.meta.description,
  applicationName: siteName,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName,
    title: wedding.meta.title,
    description: wedding.meta.description,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.meta.title,
    description: wedding.meta.description,
    images: [socialImage],
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  robots: isPreview ? { index: false, follow: false } : {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = { themeColor: "#53664e" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${jost.variable} ${pinyon.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
