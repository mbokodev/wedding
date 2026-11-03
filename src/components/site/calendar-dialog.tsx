"use client";

import { useId, useRef } from "react";
import { calendarLinks } from "@/lib/wedding-calendar";
import { wedding } from "@/config/wedding";

export function CalendarDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  return <>
    <button ref={trigger} className="calendar-button" type="button" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>Enregistrer la date <span aria-hidden="true">↗</span></button>
    <dialog ref={dialog} className="calendar-dialog" aria-labelledby={titleId} aria-describedby={descriptionId}
      onClose={() => trigger.current?.focus()}
      onClick={event => { if (event.target === event.currentTarget) {
        const box = event.currentTarget.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.current?.close();
      } }}>
      <button type="button" className="calendar-dialog-close" aria-label="Fermer" onClick={() => dialog.current?.close()} autoFocus>×</button>
      <span className="calendar-dialog-heart" aria-hidden="true">♡</span>
      <h3 id={titleId}>Une date à garder</h3>
      <p className="calendar-dialog-date">{wedding.date.display} · {wedding.location.display}</p>
      <p id={descriptionId}>Choisissez votre calendrier pour réserver cette journée avec nous.</p>
      <div className="calendar-options">
        <a href={calendarLinks.google} target="_blank" rel="noopener noreferrer"><span>Google Agenda</span><small>Ouvrir l’événement prérempli ↗</small></a>
        <a href="/mariage-ange-cedric.ics"><span>Calendrier Apple</span><small>Ouvrir le fichier sur iPhone ou Mac</small></a>
        <a href={calendarLinks.outlook} target="_blank" rel="noopener noreferrer"><span>Outlook</span><small>Ouvrir l’événement prérempli ↗</small></a>
        <a href="/mariage-ange-cedric.ics" download><span>Autre calendrier</span><small>Télécharger le fichier .ics</small></a>
      </div>
      <p className="calendar-dialog-help">Le programme et le lien du site sont inclus. Validez ensuite l’ajout dans votre calendrier.</p>
    </dialog>
  </>;
}
