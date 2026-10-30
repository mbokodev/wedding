import { z } from "zod";
import { isRateLimited, recordFailedAttempt } from "@/server/auth/rate-limit";

const responseSchema = z.object({
  attendance: z.enum(["yes", "no"]),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40).regex(/^[+\d\s().-]+$/),
  message: z.string().trim().max(1000),
});

export async function POST(request: Request) {
  const error = (message: string, status: number) => Response.json({ error: message }, { status });
  const origin = request.headers.get("origin");
  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : new URL(request.url).origin;
  if (!origin || origin !== allowedOrigin) return error("Origine non autorisée.", 403);
  const key = `rsvp:${request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"}`;
  if (isRateLimited(key)) return error("Merci de patienter avant de réessayer.", 429);
  recordFailedAttempt(key);
  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 8000) return error("Message trop long.", 413);
    input = JSON.parse(raw);
  } catch { return error("Réponse invalide.", 400); }
  const parsed = responseSchema.safeParse(input);
  if (!parsed.success) return error("Vérifiez votre nom, votre téléphone et votre message.", 400);
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return error("Les confirmations en ligne ne sont pas encore ouvertes. Merci de réessayer plus tard.", 503);
  const { name, phone, attendance, message } = parsed.data;
  try {
    const result = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: `Mariage Ange & Cédric — Réponse invité\n\nNom : ${name}\nTéléphone : ${phone}\nPrésence : ${attendance === "yes" ? "Oui, avec plaisir" : "Non"}\n\nMessage : ${message || "—"}`, link_preview_options: { is_disabled: true } }),
      signal: AbortSignal.timeout(10000),
    });
    const body = await result.json();
    if (!result.ok || body.ok !== true) return error("Votre réponse n’a pas pu être transmise. Merci de réessayer.", 502);
    return Response.json({ ok: true });
  } catch { return error("L’envoi n’a pas pu être confirmé. Merci de réessayer plus tard.", 502); }
}
