/**
 * Génère des images SVG placeholders élégantes dans /public/images/placeholders.
 * Ces fichiers sont destinés à être remplacés par de vraies photos
 * (même noms de fichiers, ou mettre à jour src/config/wedding.ts).
 *
 * Usage : node scripts/generate-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "images", "placeholders");
mkdirSync(outDir, { recursive: true });

const palettes = [
  ["#EFE6D8", "#DCCBB0"], // champagne
  ["#E7EAE0", "#C3CDB4"], // sauge clair
  ["#F1EAE0", "#D9C6A8"], // ivoire doré
];

function svg({ width, height, from, to, label }) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * 0.16;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <g fill="none" stroke="#B08D57" stroke-opacity="0.45">
    <circle cx="${cx}" cy="${cy}" r="${r}" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 1.35}" stroke-width="0.75" stroke-dasharray="2 6"/>
  </g>
  <text x="${cx}" y="${cy - r * 0.05}" text-anchor="middle" font-family="Georgia, serif" font-size="${r * 0.62}" fill="#8A7355" font-style="italic">C &amp; A</text>
  <text x="${cx}" y="${cy + r * 0.55}" text-anchor="middle" font-family="Georgia, serif" font-size="${r * 0.22}" letter-spacing="3" fill="#8A7355">${label}</text>
</svg>
`;
}

const images = [
  { name: "hero", width: 1920, height: 1280, palette: 2, label: "PHOTO À VENIR" },
  { name: "story-1", width: 900, height: 1100, palette: 0, label: "LA RENCONTRE" },
  { name: "story-2", width: 900, height: 1100, palette: 1, label: "LE VOYAGE" },
  { name: "story-3", width: 900, height: 1100, palette: 2, label: "LA DEMANDE" },
  { name: "venue-1", width: 1200, height: 800, palette: 1, label: "CÉRÉMONIE" },
  { name: "venue-2", width: 1200, height: 800, palette: 0, label: "RÉCEPTION" },
  ...Array.from({ length: 8 }, (_, i) => ({
    name: `gallery-${i + 1}`,
    width: i % 3 === 0 ? 900 : 1200,
    height: i % 3 === 0 ? 1200 : 900,
    palette: i % 3,
    label: `PHOTO ${i + 1}`,
  })),
];

for (const img of images) {
  const [from, to] = palettes[img.palette];
  writeFileSync(
    join(outDir, `${img.name}.svg`),
    svg({ ...img, from, to })
  );
  console.log(`✓ ${img.name}.svg`);
}
console.log(`\n${images.length} placeholders générés dans public/images/placeholders/`);
