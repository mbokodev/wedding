"use client";

import { type CSSProperties } from "react";
import Image from "next/image";
import { wedding } from "@/config/wedding";
import { home } from "@/config/home";
import { Petals } from "@/components/site/petals";
import { useWeddingMotion } from "@/components/site/wedding-experience";
import { photos } from "@/config/public-content";
import { Reveal } from "@/components/ui/reveal";

export function Hero() {
  const { paused } = useWeddingMotion();
  const orbitPhotos = [photos.portrait, photos.walk, photos.maternity, photos.portrait, photos.walk];
  return (
    <section id="accueil" className={`dream-hero${paused ? " dream-paused" : ""}`} aria-labelledby="announcement-title">
      <noscript><style>{`.wedding-home .dream-hero .reveal { opacity: 1 !important; transform: none !important; }`}</style></noscript>
      <div className="dream-stage">
        <Petals />
        <Image src={home.background.src} alt={home.background.alt} fill sizes="100vw" preload className="dream-background-image" />
        <div className="dream-background-veil" aria-hidden="true" />
        <div className="dream-cloud dream-cloud-left" aria-hidden="true" />
        <div className="dream-cloud dream-cloud-right" aria-hidden="true" />
        <div className="dream-floral-corners" aria-hidden="true">
          {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(corner => (
            <div key={corner} className={`dream-floral dream-floral-${corner}`}>
              <Image src={`/images/generated/hero-floral-${corner.startsWith("top") ? "branches" : "roses"}.png`} alt="" fill sizes="(max-width: 767px) 180px, 360px" />
            </div>
          ))}
        </div>
        <div className="dream-stars" aria-hidden="true">{Array.from({length: 12}, (_, i) => <span key={i} style={{left: `${7 + (i * 31) % 88}%`, top: `${8 + (i * 17) % 73}%`, animationDelay: `${i * -.6}s`}}>✦</span>)}</div>

        <div className="dream-heading">
          <p className="dream-chapter-signature"><span>Le commencement</span> <em>d’un nouveau chapitre</em></p>
          <div className="dream-signature-flourish" aria-hidden="true"><span />✧<span /></div>
        </div>

        <h1 id="announcement-title" className="sr-only">Mariage d’Ange et Cédric — 26 décembre 2026</h1>
        <aside className="dream-announcement dream-scripture" aria-label="Genèse 2:24">
          <Reveal className="hero-verse-reveal hero-verse-left">
          <span className="dream-verse-star" aria-hidden="true">✧</span>
          <blockquote><p>« {home.heroVerses[0].text} »</p><cite><a href={home.heroVerses[0].url} target="_blank" rel="noreferrer">{home.heroVerses[0].reference}</a><small>Louis Segond 1910</small></cite></blockquote>
          </Reveal>
        </aside>

        <Reveal as="figure" className="dream-portrait hero-portrait-reveal">
          <div className="dream-portrait-halo" aria-hidden="true" />
          <div className="dream-portrait-frame">
            <div className="dream-orbit" aria-label="Photos souvenirs en cercle autour du portrait">
              {home.memories.map((memory, i) => (
                <div className="dream-orbit-slot" key={memory} style={{ "--orbit-angle": `${i * 360 / home.memories.length}deg` } as CSSProperties}>
                  <div className="dream-orbit-counter">
                    <div className="dream-bubble">
                      <Image src={orbitPhotos[i].src} alt={`${memory} — ${orbitPhotos[i].label}`} fill sizes="100px" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="dream-photo">
              <Image src={home.portrait.src} alt={home.portrait.alt} fill sizes="(max-width: 767px) 58vw, 340px" preload className="dream-couple-photo" />
            </div>
          </div>
          <figcaption className="dream-faith-signature"><span className="faith-signature-intro">Unis par l’amour,</span><strong>guidés par Dieu.</strong><span className="faith-signature-rule" aria-hidden="true">✧</span></figcaption>
        </Reveal>



        <div className="dream-event">
          <div className="dream-event-details"><time dateTime="2026-12-26">{wedding.date.display}</time><span aria-hidden="true">✦</span><span>{wedding.location.display}</span></div>
          <a href="#histoire" className="home-button">Découvrir notre histoire <span aria-hidden="true">↓</span></a>
        </div>
        <aside className="dream-blessing dream-scripture" aria-label="Ecclésiaste 4:9-12">
          <Reveal className="hero-verse-reveal hero-verse-right">
          <span className="dream-verse-star" aria-hidden="true">✧</span>
          <blockquote><p>« {home.heroVerses[1].text} »</p><cite><a href={home.heroVerses[1].url} target="_blank" rel="noreferrer">{home.heroVerses[1].reference} · extraits</a><small>Louis Segond 1910</small></cite></blockquote>
          </Reveal>
        </aside>
      </div>
    </section>
  );
}
