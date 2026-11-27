import type { Metadata } from "next";
import { wedding } from "@/config/wedding";
import { siteUrl, siteName, socialImage, publicSiteSchema } from "@/config/seo";
import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { MusicToggle } from "@/components/site/music-toggle";
import { WeddingExperience } from "@/components/site/wedding-experience";
import { LoveRibbon, OurStory, OurFamily, WeddingDay, AttendanceSection, WeddingFooter } from "@/components/site/public-sections";
import "./home.css";
import "./chapters.css";

export const metadata: Metadata = {
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website", locale: "fr_FR", siteName,
    title: wedding.meta.title, description: wedding.meta.description,
    url: siteUrl, images: [socialImage],
  },
};

export default function HomePage() {
  return <WeddingExperience>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(publicSiteSchema).replace(/</g, "\\u003c") }} />
    <SiteHeader />
    <main id="contenu" tabIndex={-1}>
      <Hero />
      <LoveRibbon />
      <OurStory />
      <OurFamily />
      <WeddingDay />
      <AttendanceSection />
    </main>
    <WeddingFooter />
    <MusicToggle />
  </WeddingExperience>;
}
