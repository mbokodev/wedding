"use client";

import { useState } from "react";

export function AttendanceForm() {
  const [review, setReview] = useState(false);
  const [attendance, setAttendance] = useState("yes");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  async function sendResponse() {
    if (pending || sent) return;
    setPending(true); setError("");
    try {
      const response = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ attendance, name, phone, message }) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "L’envoi a échoué. Merci de réessayer.");
      setSent(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "L’envoi a échoué."); }
    finally { setPending(false); }
  }
  return <form className="attendance-form" onSubmit={event => { event.preventDefault(); setReview(true); }}>
    <span className="attendance-seal" aria-hidden="true">♡</span>
    <h3>Confirmer ma présence</h3>
    <p>Un petit mot de vous, beaucoup de joie pour nous.</p>
    <div className="attendance-progress" aria-label={review ? "Étape 2 sur 2 : récapitulatif" : "Étape 1 sur 2 : votre réponse"}><span>♡</span><span className={review ? "is-active" : ""}>♡</span></div>
    {!review ? <>
      <fieldset><legend>Serez-vous des nôtres ?</legend><div className="attendance-choices">
        <label><input type="radio" name="attendance" value="yes" checked={attendance === "yes"} onChange={e => setAttendance(e.target.value)} /> Oui, avec plaisir</label>
        <label><input type="radio" name="attendance" value="no" checked={attendance === "no"} onChange={e => setAttendance(e.target.value)} /> Malheureusement non</label>
      </div></fieldset>
      <label>Votre nom<input required maxLength={120} autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Prénom et nom" /></label>
      <label>Votre téléphone ou WhatsApp<input required type="tel" maxLength={40} autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Avec l’indicatif du pays" /></label>
      <label>Un petit mot pour nous <small>(facultatif)</small><textarea maxLength={1000} rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="Votre message…" /></label>
      <button type="submit">Continuer <span aria-hidden="true">→</span></button>
    </> : <div className="attendance-review">
      <h4>Votre réponse</h4><p><strong>{name}</strong><br />{phone}</p><p>{attendance === "yes" ? "Oui, avec plaisir" : "Malheureusement non"}</p>{message && <p>{message}</p>}
      {sent ? <p role="status">Merci ! Votre réponse a bien été transmise à Ange et Cédric.</p> : <>
        <p className="attendance-privacy">En envoyant, vous transmettez ces informations à Ange et Cédric via Telegram pour l’organisation du mariage.</p>
        {error && <p role="alert">{error}</p>}
        <button type="button" disabled={pending} onClick={sendResponse}>{pending ? "Envoi en cours…" : "Envoyer ma réponse"}</button>
        <button type="button" disabled={pending} onClick={() => setReview(false)}>Modifier ma réponse</button>
      </>}
    </div>}
  </form>;
}
