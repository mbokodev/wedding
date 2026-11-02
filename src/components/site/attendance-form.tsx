"use client";

import { useEffect, useRef, useState } from "react";
import { attendanceSides } from "@/config/attendance";

export function AttendanceForm() {
  const [step, setStep] = useState(1);
  const [attendance, setAttendance] = useState("yes");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [side, setSide] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current !== step) stepHeading.current?.focus();
    previousStep.current = step;
  }, [step]);

  async function sendResponse() {
    if (pending || step !== 2) return;
    setPending(true); setError("");
    try {
      const response = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ attendance, name, phone, side, message }) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "L’envoi a échoué. Merci de réessayer.");
      setStep(3);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "L’envoi a échoué."); }
    finally { setPending(false); }
  }
  function restart() {
    setAttendance("yes"); setName(""); setPhone(""); setSide(""); setMessage(""); setError(""); setStep(1);
  }
  return <form className="attendance-form" onSubmit={event => {
    event.preventDefault();
    if (step === 1) {
      if (name.trim().length < 2 || phone.trim().length < 6 || !/^[+\d\s().-]+$/.test(phone.trim())) {
        setError("Vérifiez votre nom et votre numéro de téléphone."); return;
      }
      setError(""); setStep(2);
    } else if (step === 2) void sendResponse();
  }} aria-busy={pending}>
    <span className="attendance-seal" aria-hidden="true">♡</span>
    <h3 ref={stepHeading} tabIndex={-1}>{step === 3 ? "Merci pour votre réponse !" : "Confirmer ma présence"}</h3>
    <p>Un petit mot de vous, beaucoup de joie pour nous.</p>
    <div className="attendance-progress" aria-label={`Étape ${step} sur 3`}>
      {[1, 2, 3].map(number => <span key={number} className={number <= step ? "is-active" : ""} aria-current={number === step ? "step" : undefined}>{number}</span>)}
    </div>
    {step === 1 && <>
      <fieldset><legend>Serez-vous présent(e) ?</legend><div className="attendance-choices">
        <label><input type="radio" name="attendance" value="yes" checked={attendance === "yes"} onChange={e => setAttendance(e.target.value)} /> Oui, avec plaisir.</label>
        <label><input type="radio" name="attendance" value="no" checked={attendance === "no"} onChange={e => setAttendance(e.target.value)} /> Malheureusement non</label>
      </div></fieldset>
      <label>Votre nom<input required minLength={2} maxLength={120} autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Prénom et nom" /></label>
      <label>Votre numéro de téléphone<input required type="tel" minLength={6} maxLength={40} autoComplete="tel" placeholder="XX XX XX XX XX" value={phone} onChange={e => setPhone(e.target.value)} /></label>
      {error && <p role="alert">{error}</p>}
      <button type="submit">Continuer <span aria-hidden="true">→</span></button>
    </>}
    {step === 2 && <>
      <label>Vous venez de quel côté ?<select required value={side} disabled={pending} onChange={e => setSide(e.target.value)}>
        <option value="" disabled>Choisissez votre côté</option>
        {attendanceSides.map(option => <option key={option} value={option}>{option}</option>)}
      </select></label>
      <label>Un petit mot pour nous <small>(facultatif)</small><textarea maxLength={1000} rows={3} disabled={pending} value={message} onChange={e => setMessage(e.target.value)} placeholder="Votre message…" /></label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Envoi en cours…" : attendance === "yes" ? "Confirmer ma présence" : "Envoyer ma réponse"}</button>
      <button type="button" disabled={pending} onClick={() => { setError(""); setStep(1); }}>Retour</button>
    </>}
    {step === 3 && <div className="attendance-review">
      <p role="status">Merci {name} ! {attendance === "yes" ? "Votre présence a bien été confirmée. Nous avons hâte de partager ce grand jour avec vous. 🤍" : "Votre réponse a bien été transmise. Vous nous manquerez, mais nous vous remercions de nous avoir prévenus. 🤍"}</p>
      <button type="button" onClick={restart}>Recommencer</button>
    </div>}
  </form>;
}
