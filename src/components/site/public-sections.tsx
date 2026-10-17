import Image from "next/image";
import { wedding } from "@/config/wedding";
import { home } from "@/config/home";
import { chapters, photos, practicalInfos, questions } from "@/config/public-content";
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
  const words = ["Ange & Cédric", "26 décembre 2026", "Douala, Cameroun", "Sauge, or & blanc", "Une histoire à partager"];
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
            {[photos.walk, photos.portrait, photos.walk, photos.portrait].map((photo, index) => <div key={index} className={`story-orbit-memory story-orbit-memory-${index + 1}`}><PhotoMemory photo={photo} caption="Photo provisoire" sizes="(max-width: 767px) 38vw, 220px" /></div>)}
          </div> : chapter.media.length ? <StoryGallery media={chapter.media} caption={chapter.aside} /> : <div className="distance-map" aria-label="Cédric part au Canada, puis Ange en France un an plus tard">
            <div className="distance-map-stars" aria-hidden="true">✦<span>✧</span>✦</div>
            <p className="home-eyebrow">Notre amour voyage</p>
            <div className="distance-map-origin">Notre chemin<span>Avant les départs</span></div>
            <svg viewBox="0 0 400 150" fill="none" aria-hidden="true"><path className="flight-path" d="M200 0C200 80 50 20 50 145M200 0C200 85 350 30 350 145" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 8" /><circle cx="200" cy="8" r="5" fill="currentColor" /><circle cx="50" cy="140" r="5" fill="currentColor" /><circle cx="350" cy="140" r="5" fill="currentColor" /></svg>
            <div className="distance-destinations"><div>Canada<span>Cédric</span></div><div>France<span>Ange · un an après</span></div></div>
            <p className="distance-map-note">Deux horizons. Une même histoire.</p>
          </div>}
        </Reveal>
        <div className="story-scene-flowers" aria-hidden="true"><Image src="/images/generated/hero-floral-roses.png" alt="" fill sizes="(max-width: 767px) 120px, 220px" /></div>
      </div>)}
    </div>
    <p className="illustration-note">Les scènes illustratives sont générées en attendant nos véritables photos.</p>
  </section>;
}

export function OurFamily() {
  return <section id="famille" className="family-chapter" aria-labelledby="family-title">
    <span id="galerie" />
    <ChapterHeading id="family-title" eyebrow="Chapitre II · Notre famille" title="Notre bonheur" accent="se vit à trois." text="Notre fille, nos souvenirs, et cette famille que nous construisons ensemble." />
    <div className="family-scene">
      <Image src={photos.family.src} alt="" fill sizes="100vw" className="family-scene-background" />
      <div className="family-scene-veil" />
      <Petals gentle />
      <Reveal className="family-photo-wrap"><PhotoMemory photo={photos.family} caption="Nous trois, tout simplement." sizes="(max-width: 767px) 90vw, 65vw" /></Reveal>
      <Reveal className="family-letter" delay={180}>
        <span className="family-letter-heart" aria-hidden="true">♡</span>
        <p className="home-eyebrow">Une place dans nos cœurs</p>
        <h3>Notre petite famille</h3>
        <p>Notre fille aura quatre ans en novembre 2026. Elle fait pleinement partie de cette histoire et de la famille que nous continuons de construire.</p>
        <p>Cette page accueillera nos photos à trois, nos souvenirs et ces instants que nous avons envie de garder.</p>
        <span className="family-signature">Ange, Cédric &amp; notre fille</span>
      </Reveal>
    </div>
    <div className="family-values"><span>Les petits instants</span><i aria-hidden="true">✧</i><span>Les grands souvenirs</span><i aria-hidden="true">✧</i><span>Le bonheur d’être ensemble</span></div>
  </section>;
}

export function OurFaith() {
  return <section id="foi" className="faith-chapter" aria-labelledby="faith-title">
    <ChapterHeading id="faith-title" eyebrow="Chapitre III · Unis dans la foi" title="Un même amour," accent="une même lumière." text="La place de Dieu dans notre couple, dans nos échanges et dans le chemin que nous parcourons." />
    <div className="faith-layout">
      <Reveal className="faith-image"><PhotoMemory photo={photos.faith} className="photo-arch" caption="Un temps pour nous, un temps pour Dieu." /></Reveal>
      <Reveal className="faith-copy" delay={120}>
        <p className="home-eyebrow">Même à distance</p><h3>Se retrouver<br /><em>dans la prière.</em></h3>
        <p>Entre le Canada et la France, nos appels vidéo et nos échanges nous permettent de partager notre quotidien. La prière a aussi sa place dans ces moments à deux.</p>
        <blockquote><p>«&nbsp;{home.verses[0].text}&nbsp;»</p><cite><a href={home.verses[0].url} target="_blank" rel="noreferrer">{home.verses[0].reference}</a></cite></blockquote>
        <p>Unis par l’amour, guidés par Dieu : cette promesse accompagne le chemin que nous souhaitons parcourir ensemble.</p>
      </Reveal>
    </div>
    <Reveal className="distance-calls">
      <div className="calls-intro"><p className="home-eyebrow">Nos rendez-vous à distance</p><h3>Un écran entre nous.<br /><em>Un lien qui demeure.</em></h3><p>Quelques captures choisies de nos appels viendront raconter ces moments.</p></div>
      <div className="call-frames">
        {[{name:"Cédric", place:"Canada"}, {name:"Ange", place:"France"}].map((person, i) => <div className={`call-frame call-frame-${i}`} key={person.name}>
          <div className="call-screen"><span className="call-avatar" aria-hidden="true">{person.name.charAt(0)}</span><p>Capture à venir</p><small>Appel vidéo · 900 × 1600 px</small></div>
          <div className="call-person"><strong>{person.name}</strong><span>{person.place}</span></div>
          <div className="call-controls" aria-hidden="true"><span>♡</span><span>◉</span><span>⌁</span></div>
        </div>)}
        <span className="call-connection" aria-hidden="true">♡</span>
      </div>
    </Reveal>
  </section>;
}

export function WeddingDay() {
  return <section id="grand-jour" className="day-chapter" aria-labelledby="day-title">
    <div className="day-cover">
      <Image src={photos.reception.src} alt={photos.reception.alt} fill sizes="100vw" />
      <div className="day-cover-shade" />
      <div className="day-cover-content"><p className="home-eyebrow">Chapitre IV · Le grand jour</p><h2 id="day-title">Un jour à part.<br /><em>Une vie devant nous.</em></h2><p>26 décembre 2026 · Douala, Cameroun</p><Countdown targetIso={wedding.date.iso} /><a className="calendar-button" href="/mariage-ange-cedric.ics" download>Enregistrer la date <span aria-hidden="true">↗</span></a></div>
      <span className="day-image-note">Décor imaginé · illustration générée</span>
    </div>
    <div id="programme" className="day-program">
      <Reveal className="program-heading"><p className="home-eyebrow">Les moments de la journée</p><h3>Du premier regard<br /><em>à la dernière danse.</em></h3><span className="provisional-label">Programme prévisionnel · horaires à confirmer</span></Reveal>
      <ol className="program-steps">{wedding.program.map((step,i) => <Reveal key={step.time} as="li" delay={i * 70}><span className="program-icon" aria-hidden="true">{["♧","✧","♡","◇","♫"][i]}</span><span className="program-time">{step.time}</span><h4>{step.title}</h4><p>{step.description}</p></Reveal>)}</ol>
    </div>
    <div id="lieux" className="day-venues">
      <Reveal className="venue-intro"><p className="home-eyebrow">Les lieux de notre journée</p><h3>À Douala,<br /><em>avec vous.</em></h3><p>Les lieux ci-dessous sont provisoires. Les adresses et les itinéraires seront publiés après confirmation.</p></Reveal>
      {wedding.venues.map((venue,i) => <Reveal key={venue.name} className="venue-card" delay={i * 120}><span className="venue-number" aria-hidden="true">0{i + 1}</span><p className="home-eyebrow">{venue.role}</p><h4>{venue.name}</h4><span className="provisional-label">Lieu à confirmer</span><p>Douala, Cameroun</p></Reveal>)}
    </div>
    <Reveal as="section" className="dress-palette" >
      <div id="dress-code"><p className="home-eyebrow">L’esprit de la fête</p><h3>Sauge, or <em>&amp; blanc.</em></h3><p>Une harmonie lumineuse pour notre célébration.</p></div>
      <div className="palette-swatches">{[{name:"Vert sauge",hex:"#a3b39a"},{name:"Or doux",hex:"#b59658"},{name:"Blanc",hex:"#fffdf7"}].map(color => <div key={color.name}><span style={{background:color.hex}} /><p>{color.name}</p></div>)}</div>
      <p className="dress-note"><strong>Dress code proposé :</strong> tenue de soirée ou tenue traditionnelle élégante. Les consignes définitives, notamment concernant le blanc, restent à confirmer.</p>
    </Reveal>
  </section>;
}

export function PracticalInformation() {
  return <section id="infos" className="practical-chapter" aria-labelledby="infos-title">
    <ChapterHeading id="infos-title" eyebrow="Chapitre V · Informations pratiques" title="Tout pour" accent="nous retrouver." text="Les repères utiles pour préparer votre venue. Nous compléterons ici chaque information confirmée." />
    <div className="practical-grid">{practicalInfos.map((info,i) => <Reveal key={info.title} className="practical-card" delay={i*70}><span aria-hidden="true">{info.icon}</span><h3>{info.title}</h3><p>{info.text}</p></Reveal>)}</div>
    <div className="faq-layout"><Reveal className="faq-intro"><p className="home-eyebrow">Vous vous demandez peut-être…</p><h3>Quelques réponses,<br /><em>tout simplement.</em></h3><p>Les informations encore provisoires seront mises à jour au fil des préparatifs.</p><div className="faq-flower" aria-hidden="true">✾</div></Reveal>
      <div className="faq-items">{questions.map((item,i) => <details key={item.question} name="wedding-faq"><summary><span className="faq-number">0{i+1}</span>{item.question}<span className="faq-plus" aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
    </div>
  </section>;
}

export function WeddingFooter() {
  return <footer className="wedding-finale">
    <div className="finale-glow" aria-hidden="true" /><Petals gentle />
    <Reveal><p className="home-eyebrow">La suite de notre histoire</p><h2>On a hâte<br /><em>de vous retrouver.</em></h2><p>Merci de partager avec nous la joie de ce nouveau chapitre.</p><a href="#accueil" className="finale-names">Ange &amp; Cédric</a><p className="finale-date">26 décembre 2026 · Douala, Cameroun</p></Reveal>
    <nav aria-label="Navigation de pied de page">{home.navigation.map(item=><a key={item.href} href={item.href}>{item.label}</a>)}</nav>
    <p className="finale-note">Avec amour · Les illustrations provisoires seront remplacées par nos photos.</p>
  </footer>;
}
