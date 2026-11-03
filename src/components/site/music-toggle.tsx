"use client";

import { useEffect, useRef, useState } from "react";

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const manual = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    const start = (event: Event) => {
      if (manual.current || buttonRef.current?.contains(event.target as Node)) return;
      if (event instanceof KeyboardEvent && (event.repeat || event.key === "Tab")) return;
      void audio.play().catch(() => { /* Réessayer au prochain geste autorisé. */ });
    };
    const stopListening = () => {
      document.removeEventListener("click", start);
      document.removeEventListener("touchend", start);
      document.removeEventListener("keydown", start);
    };
    document.addEventListener("click", start);
    document.addEventListener("touchend", start, { passive: true });
    document.addEventListener("keydown", start);
    audio.addEventListener("playing", stopListening);
    void audio.play().catch(() => { /* La première interaction débloquera la lecture. */ });
    return () => {
      stopListening();
      audio.removeEventListener("playing", stopListening);
      audio.pause();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    manual.current = true;
    setFailed(false);
    if (!audio.paused) audio.pause();
    else void audio.play().catch(() => setFailed(true));
  };

  const label = playing ? "Mettre la musique en pause" : "Écouter la musique";
  return <>
    <audio ref={audioRef} src="/audio/the-story-ill-tell.mp3" loop preload="none"
      onPlaying={() => { setPlaying(true); setFailed(false); }}
      onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setFailed(true); }} />
    <button ref={buttonRef} className={`music-toggle${playing ? " is-playing" : ""}`} type="button"
      aria-label={label} aria-pressed={playing} title={label} onClick={toggle}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 18V6l11-2v12" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" />
      </svg>
    </button>
    <span role="status" className="sr-only">{failed ? "Lecture impossible pour le moment. Réessayez avec le bouton musique." : ""}</span>
  </>;
}
