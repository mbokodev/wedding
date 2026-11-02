import Image from "next/image";
import { AttendanceForm } from "@/components/site/attendance-form";
import { wedding } from "@/config/wedding";
import { home } from "@/config/home";
import { chapters, photos } from "@/config/public-content";
import { Reveal } from "@/components/ui/reveal";
import { PhotoMemory } from "@/components/site/photo-memory";
import { Petals } from "@/components/site/petals";
import { StoryGallery } from "@/components/site/story-gallery";
import { Countdown } from "@/components/site/countdown";
import { StoryVideo } from "@/components/site/story-video";

function ChapterHeading({ eyebrow, title, accent, text, id }: { eyebrow: string; title: string; accent: string; text: string; id: string }) {
  return <Reveal className="chapter-heading">
    <p className="home-eyebrow">{eyebrow}</p>
    <h2 id={id}>{title} <em>{accent}</em></h2>
    <div className="chapter-flourish" aria-hidden="true"><span />♡<span /></div>
    <p>{text}</p>
  </Reveal>;
}

export function LoveRibbon() {
  const words = ["Ange & Cédric", "26 décembre 2026", "Douala, Cameroun", "Vert sauge, blanc & or", "Une histoire à partager"];
  return <div className="love-ribbon" aria-label="Ange et Cédric, le 26 décembre 2026 à Douala"><div className="ribbon-track" aria-hidden="true">{[0, 1].map(copy => <div key={copy}>{words.map(word => <span key={word}>{word}<i>✦</i></span>)}</div>)}</div></div>;
}

export function OurStory() {
  return <section id="histoire" className="story-chapter" aria-labelledby="story-title">
    <div className="story-garden" aria-hidden="true">
      <div className="story-garden-scene">
        <Image src="/images/generated/story-garden-sage.png" alt="" fill sizes="100vw" />
        <div className="story-garden-veil" />
        <Petals gentle />
      </div>
    </div>
    <ChapterHeading id="story-title" eyebrow="Chapitre I · Notre histoire" title="Un chemin," accent="notre chemin." text="Des premiers pas à ce grand oui, voici les étapes qui nous ont menés jusqu’ici." />
    <div className="story-albums">
      <svg className="story-golden-path" viewBox="0 0 100 1200" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M50 0C5 100 95 140 50 220S5 350 50 420S95 550 50 620S5 750 50 820S95 950 50 1020S5 1140 50 1200" /></svg>
      {chapters.map(chapter => <div id={`histoire-${chapter.number}`} className="story-album" key={chapter.number}>
        <Reveal className="story-album-heading">
          <span className="story-album-number" aria-hidden="true">{chapter.number}</span>
          <p className="home-eyebrow">{chapter.tag}</p>
          <h3>{chapter.title}</h3>
          <div className="story-scene-flourish" aria-hidden="true">✧</div>
          <p className="story-scene-description"><span className="story-desktop-text">{chapter.text}</span><span className="story-mobile-text">{chapter.mobileText}</span></p>
          {chapter.number === "06" && <a className="text-link" href="#grand-jour">Découvrir le grand jour <span aria-hidden="true">↗</span></a>}
        </Reveal>
        <Reveal className="story-album-media">
          {chapter.number === "02" ? <div className="story-video-constellation">
            <StoryVideo />
            {[photos.momentsDouala, photos.momentsTogether, photos.momentsSofa, photos.momentsEmbrace].map((photo, index) => <div key={index} className={`story-orbit-memory story-orbit-memory-${index + 1}`}><PhotoMemory photo={photo} caption={index === 0 ? "À Douala, ensemble" : index === 1 ? "Un instant à deux" : index === 2 ? "Tout simplement nous" : "Dans tes bras"} sizes="(max-width: 767px) 38vw, 220px" /></div>)}
          </div> : chapter.number !== "04" ? <StoryGallery media={chapter.media} caption={chapter.aside} /> : <div className="distance-map" aria-label="Cédric part au Canada, puis Ange en France un an plus tard">
            <div className="distance-map-stars" aria-hidden="true">✦<span>✧</span>✦</div>
            <p className="home-eyebrow">Notre amour voyage</p>
            <div className="distance-map-origin">Notre chemin<span>Avant les départs</span></div>
            <svg viewBox="0 0 400 150" fill="none" aria-hidden="true"><path className="flight-path" d="M200 0C200 80 50 20 50 145M200 0C200 85 350 30 350 145" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 8" /><circle cx="200" cy="8" r="5" fill="currentColor" /><circle cx="50" cy="140" r="5" fill="currentColor" /><circle cx="350" cy="140" r="5" fill="currentColor" /></svg>
            <div className="distance-destinations">{chapter.media.map((item, index) => item.kind === "image" && <div className="distance-destination" key={item.photo.src}>
              <div>{index === 0 ? "Canada" : "France"}</div>
              <PhotoMemory photo={item.photo} caption={index === 0 ? "Cédric" : "Ange · un an après"} sizes="(max-width: 767px) 45vw, 260px" />
            </div>)}</div>
            <p className="distance-map-note">Deux horizons. Une même histoire.</p>
          </div>}
        </Reveal>
        <div className="story-scene-flowers" aria-hidden="true"><Image src="/images/generated/hero-floral-roses.png" alt="" fill sizes="(max-width: 767px) 120px, 220px" /></div>
      </div>)}
    </div>
  </section>;
}

export function OurFamily() {
  return <section id="famille" className="family-chapter" aria-labelledby="family-title">
    <Image src={photos.family.src} alt="" fill sizes="100vw" className="family-scene-background" />
    <div className="family-scene-veil" aria-hidden="true" />
    <span id="galerie" />
    <ChapterHeading id="family-title" eyebrow="Chapitre II · Notre famille" title="Notre bonheur" accent="se vit à trois." text="Notre fille, nos souvenirs, et cette famille que nous construisons ensemble." />
    <div className="family-scene">
      <Petals gentle />
      <Reveal className="family-photo-wrap"><PhotoMemory photo={photos.family} caption="Nous trois, tout simplement." sizes="(max-width: 767px) 90vw, 65vw" /></Reveal>
      <Reveal className="family-letter" delay={180}>
        <span className="family-letter-heart" aria-hidden="true">♡</span>
        <p className="home-eyebrow">Une place dans nos cœurs</p>
        <h3>Notre petite famille</h3>
        <p>Notre fille aura quatre ans en novembre 2026. Elle fait pleinement partie de cette histoire et de la famille que nous continuons de construire.</p>
        <span className="family-signature">Ange, Cédric &amp; notre fille</span>
      </Reveal>
    </div>
    <div className="family-values"><span>Les petits instants</span><i aria-hidden="true">✧</i><span>Les grands souvenirs</span><i aria-hidden="true">✧</i><span>Le bonheur d’être ensemble</span></div>
  </section>;
}

export function WeddingDay() {
  return <section id="grand-jour" className="day-chapter" aria-labelledby="day-title">
    <div className="day-cover">
      <Image src={photos.reception.src} alt={photos.reception.alt} fill sizes="100vw" />
      <div className="day-cover-shade" />
      <div className="day-cover-content"><p className="home-eyebrow">Chapitre III · Le grand jour</p><h2 id="day-title">Un jour à part.<br /><em>Une vie devant nous.</em></h2><p>26 décembre 2026 · Douala, Cameroun</p><Countdown targetIso={wedding.date.iso} /><a className="calendar-button" href="/mariage-ange-cedric.ics" download>Enregistrer la date <span aria-hidden="true">↗</span></a></div>
    </div>
    <div id="programme" className="day-program">
      <Reveal className="program-heading"><p className="home-eyebrow">Les moments de la journée</p><h3>Du premier regard<br /><em>à la dernière danse.</em></h3><span className="provisional-label">Programme prévisionnel · horaires à confirmer</span></Reveal>
      <ol className="program-steps">{wedding.program.map((step,i) => <Reveal key={step.time} as="li" delay={i * 70}><span className="program-icon" aria-hidden="true">{["♧","✧","♡","◇","♫"][i]}</span><span className="program-time">{step.time}</span><h4>{step.title}</h4><p>{step.description}</p></Reveal>)}</ol>
    </div>
    <section id="dress-code" className="dress-theme" aria-labelledby="dress-title">
      <Petals gentle />
      <div className="dress-theme-layout">
        <Reveal className="dress-theme-copy">
          <h3 id="dress-title"><span className="dress-theme-label">Notre thème</span>Vert sauge, <em>blanc &amp; or.</em></h3>
          <div className="dress-ornament" aria-hidden="true"><span />♡<span /></div>
          <div className="palette-swatches">{[{name:"Vert sauge",hex:"#a3b39a"},{name:"Blanc",hex:"#fffdf7"},{name:"Or",hex:"#b59658"}].map(color => <div key={color.name}><span style={{background:color.hex}} /><p>{color.name}</p></div>)}</div>
          <p className="dress-invitation">Des nuances douces, une touche d’or et le plaisir de célébrer ensemble. Venez élégants, venez vous-mêmes.</p>
          <p className="dress-signature">Une harmonie qui nous ressemble.</p>
          <p className="dress-note"><strong>Dress code proposé :</strong> tenue de soirée ou tenue traditionnelle élégante. Les consignes définitives, notamment concernant le blanc, restent à confirmer.</p>
        </Reveal>
        <Reveal className="dress-theme-visual" delay={160}>
          <Image src="/images/generated/tenues-soiree-sauge.png" alt="Inspiration de tenues de soirée : costume sauge pour homme et robe satinée sauge avec accessoires dorés pour femme" width={1122} height={1402} sizes="(max-width: 767px) 90vw, 45vw" />
        </Reveal>
      </div>
    </section>
  </section>;
}

export function AttendanceSection() {
  return <section id="confirmation" className="attendance-closing" aria-labelledby="attendance-title">
    <div className="attendance-veil" aria-hidden="true" />
    <Petals gentle />
    <div className="attendance-layout">
      <Reveal className="attendance-welcome">
        <div className="attendance-portrait"><Image src="/images/generated/ange-cedric-baiser-sauge.png" alt="Ange embrassant Cédric sur la joue, portrait cadré au torse" width={1122} height={1402} sizes="(max-width: 767px) 90vw, 45vw" /></div>
        <div className="attendance-overlay-copy"><p className="attendance-script">Le plus beau jour se partage…</p>
        <h2 id="attendance-title">Et si vous étiez<br /><em>à nos côtés ?</em></h2>
        <p>Un sourire, une étreinte, une danse… Nous avons hâte de vivre ces instants avec vous.</p>
        <span className="attendance-date">26 décembre 2026 · Douala</span></div>
      </Reveal>
      <Reveal className="attendance-card" delay={120}><AttendanceForm /></Reveal>
    </div>
  </section>;
}

export function WeddingFooter() {
  return <footer className="wedding-finale">
    <div className="finale-glow" aria-hidden="true" /><Petals gentle />
    <Reveal><p className="home-eyebrow">La suite de notre histoire</p><h2>On a hâte<br /><em>de vous retrouver.</em></h2><p>Merci de partager avec nous la joie de ce nouveau chapitre.</p><a href="#accueil" className="finale-names">Ange &amp; Cédric</a><p className="finale-date">26 décembre 2026 · Douala, Cameroun</p></Reveal>
    <nav aria-label="Navigation de pied de page">{home.navigation.map(item=><a key={item.href} href={item.href}>{item.label}</a>)}</nav>
  </footer>;
}
