import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { WeddingExperience } from "@/components/site/wedding-experience";
import { LoveRibbon, OurStory, OurFamily, OurFaith, WeddingDay, PracticalInformation, WeddingFooter } from "@/components/site/public-sections";
import "./home.css";
import "./chapters.css";

export default function HomePage() {
  return <WeddingExperience>
    <SiteHeader />
    <main id="contenu" tabIndex={-1}>
      <Hero />
      <LoveRibbon />
      <OurStory />
      <OurFamily />
      <OurFaith />
      <WeddingDay />
      <PracticalInformation />
    </main>
    <WeddingFooter />
  </WeddingExperience>;
}
