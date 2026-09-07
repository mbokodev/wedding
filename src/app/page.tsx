import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { Story } from "@/components/site/story";
import { Program } from "@/components/site/program";
import { Venues } from "@/components/site/venues";
import { DressCode } from "@/components/site/dress-code";
import { Gallery } from "@/components/site/gallery";
import { Infos } from "@/components/site/infos";
import { SiteFooter } from "@/components/site/site-footer";

/**
 * Page principale du site public.
 * Toutes les sections sont regroupées sur une seule landing page
 * pour une expérience fluide ; les routes /programme, /notre-histoire,
 * /infos et /galerie redirigent vers les ancres correspondantes.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Story />
        <Program />
        <Venues />
        <DressCode />
        <Gallery />
        <Infos />
      </main>
      <SiteFooter />
    </>
  );
}
