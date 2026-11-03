import { wedding } from "@/config/wedding";

const publicSiteUrl = "https://angedecedric.com";
const start = wedding.date.iso.slice(0, 10);
const nextDay = new Date(`${start}T00:00:00Z`);
nextDay.setUTCDate(nextDay.getUTCDate() + 1);
export const calendarEvent = {
  title: `Mariage ${wedding.couple.displayName}`,
  start,
  end: nextDay.toISOString().slice(0, 10),
  location: wedding.location.display,
  description: [
    "Nous avons hâte de partager ce grand jour avec vous !",
    "Programme (heure locale de Douala) :",
    ...wedding.program.map(step => `${step.time} — ${step.title} : ${step.description}`),
    "",
    publicSiteUrl,
  ].join("\n"),
};

export const calendarLinks = {
  google: `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE", text: calendarEvent.title,
    dates: `${calendarEvent.start.replaceAll("-", "")}/${calendarEvent.end.replaceAll("-", "")}`,
    details: calendarEvent.description, location: calendarEvent.location, ctz: "Africa/Douala",
  })}`,
  outlook: `https://outlook.live.com/calendar/0/deeplink/compose?${new URLSearchParams({
    path: "/calendar/action/compose", rru: "addevent", subject: calendarEvent.title,
    startdt: calendarEvent.start, enddt: calendarEvent.end, allday: "true",
    body: calendarEvent.description, location: calendarEvent.location,
  })}`,
};

const escapeText = (text: string) => text.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
// iCalendar lines are folded at 75 UTF-8 octets without splitting characters.
function foldLine(line: string) {
  let result = "", length = 0;
  const encoder = new TextEncoder();
  for (const character of line) {
    const bytes = encoder.encode(character).length;
    if (length + bytes > 75) { result += "\r\n "; length = 1; }
    result += character; length += bytes;
  }
  return result;
}
export function createWeddingCalendar() {
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ange de Cedric//Mariage//FR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT", "UID:mariage-20261226@angedecedric.com", "DTSTAMP:20261102T000000Z",
    `DTSTART;VALUE=DATE:${calendarEvent.start.replaceAll("-", "")}`,
    `DTEND;VALUE=DATE:${calendarEvent.end.replaceAll("-", "")}`,
    `SUMMARY:${escapeText(calendarEvent.title)}`, `LOCATION:${escapeText(calendarEvent.location)}`,
    `DESCRIPTION:${escapeText(calendarEvent.description)}`, `URL:${publicSiteUrl}`,
    "STATUS:CONFIRMED", "TRANSP:OPAQUE", "END:VEVENT", "END:VCALENDAR",
  ].map(foldLine).join("\r\n") + "\r\n";
}
