"use client";

import { useEffect, useRef } from "react";

export function StoryVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const frameRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const expandedRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let visible = false;
    const syncPlayback = () => {
      if (visible && !document.hidden) {
        void video.play().catch(() => {
          // The enlarged player remains available if autoplay is blocked.
        });
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.4;
      syncPlayback();
    }, { threshold: [0, 0.4] });
    observer.observe(frameRef.current ?? video);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, []);

  return <>
    <button ref={frameRef} className="story-complicity-frame" type="button" aria-label="Agrandir la vidéo : nos moments de complicité" onClick={() => {
      videoRef.current?.pause();
      dialogRef.current?.showModal();
      if (expandedRef.current) {
        expandedRef.current.currentTime = videoRef.current?.currentTime ?? 0;
        void expandedRef.current.play().catch(() => {});
      }
    }}>
      <video ref={videoRef} className="story-complicity-video" src="/videos/ange-cedric-lumiere-couleurs.mp4" muted playsInline loop preload="metadata" />
    </button>
    <dialog ref={dialogRef} className="photo-dialog story-video-dialog" aria-label="Nos moments de complicité" onClick={event => {
      if (event.target === event.currentTarget) dialogRef.current?.close();
    }} onClose={() => {
      expandedRef.current?.pause();
      const frame = frameRef.current?.getBoundingClientRect();
      if (frame && frame.top < window.innerHeight && frame.bottom > 0) void videoRef.current?.play().catch(() => {});
    }}>
      <button type="button" className="photo-close" autoFocus onClick={() => dialogRef.current?.close()}>Fermer <span aria-hidden="true">×</span></button>
      <video ref={expandedRef} src="/videos/ange-cedric-lumiere-couleurs.mp4" controls playsInline preload="none" />
    </dialog>
  </>;
}
