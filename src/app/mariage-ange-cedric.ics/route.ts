import { createWeddingCalendar } from "@/lib/wedding-calendar";

export const dynamic = "force-static";

export function GET() {
  return new Response(createWeddingCalendar(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="mariage-ange-cedric.ics"',
    },
  });
}
