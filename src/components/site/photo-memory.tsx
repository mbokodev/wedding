"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import type { PublicPhoto } from "@/config/public-content";

export function PhotoMemory({ photo, className = "", caption, sizes = "(max-width: 767px) 90vw, 45vw" }: { photo: PublicPhoto; className?: string; caption?: string; sizes?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return (
    <figure className={`photo-memory ${className}`}>
      <button className="photo-open" type="button" aria-label={`Agrandir : ${photo.alt}`} onClick={() => dialog.current?.showModal()}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} style={{ objectPosition: photo.position ?? "center" }} />
        <span className="photo-zoom" aria-hidden="true">↗</span>
      </button>
      <figcaption><span>{caption ?? photo.label}</span><small>{caption ? photo.label : ""}</small></figcaption>
      <dialog ref={dialog} className="photo-dialog" aria-labelledby={titleId} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <button type="button" className="photo-close" onClick={() => dialog.current?.close()} autoFocus>Fermer <span aria-hidden="true">×</span></button>
        <div className="photo-dialog-image"><Image src={photo.src} alt={photo.alt} fill sizes="90vw" /></div>
        <p id={titleId}>{caption ?? photo.alt}</p><small>{photo.label}</small>
      </dialog>
    </figure>
  );
}
