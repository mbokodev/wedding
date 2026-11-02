import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

// Dessin vectoriel source : les lettres sont des tracés, sans police externe.
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve('next/package.json'));
const sharp = nextRequire('sharp');
const icon = await readFile('src/app/icon.svg');
await mkdir('public/images', { recursive: true });
await sharp(icon).resize(180, 180).png().toFile('src/app/apple-icon.png');
await sharp(icon).resize(512, 512).png().toFile('public/images/monogramme-ange-cedric.png');

// ICO multirésolution : PNG encapsulés, du petit onglet à l’écran haute densité.
const sizes = [16, 32, 48, 64, 256];
const entries = await Promise.all(sizes.map(size => sharp(icon).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
entries.forEach((png, i) => {
  const start = 6 + i * 16;
  header[start] = sizes[i] === 256 ? 0 : sizes[i];
  header[start + 1] = header[start];
  header.writeUInt16LE(1, start + 4);
  header.writeUInt16LE(32, start + 6);
  header.writeUInt32LE(png.length, start + 8);
  header.writeUInt32LE(offset, start + 12);
  offset += png.length;
});
await writeFile('src/app/favicon.ico', Buffer.concat([header, ...entries]));

const emblem = icon.toString().replace('<svg ', '<svg x="86" y="167" width="280" height="280" ');
const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#fbf8ee"/><stop offset="1" stop-color="#e4e9dc"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#paper)"/>
<circle cx="1140" cy="20" r="290" fill="none" stroke="#bec9ae" stroke-width="2"/>
<circle cx="1140" cy="20" r="270" fill="none" stroke="#d6bd7d" stroke-width="1"/>
<circle cx="30" cy="630" r="140" fill="none" stroke="#bec9ae" stroke-width="2"/>
<rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="#b59658" stroke-width="2"/>
${emblem}
<g fill="#53664e">
<text x="431" y="196" font-family="Arial, sans-serif" font-size="18" letter-spacing="6">NOUS NOUS MARIONS</text>
<text x="426" y="300" font-family="Georgia, serif" font-size="76">Ange &amp; Cédric</text>
<text x="431" y="355" font-family="Georgia, serif" font-size="27" font-style="italic">Unis par l’amour, guidés par Dieu.</text>
<path d="M431 394h640" stroke="#b59658"/>
<text x="431" y="445" font-family="Arial, sans-serif" font-size="26" letter-spacing="2">26 DÉCEMBRE 2026</text>
<text x="431" y="488" font-family="Arial, sans-serif" font-size="21">Douala, Cameroun</text>
<text x="600" y="566" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" letter-spacing="3">angedecedric.com</text>
</g></svg>`;
await sharp(Buffer.from(card)).png().toFile('public/images/partage-mariage.png');
console.log('Favicon SVG/ICO, icône Apple et image de partage générés.');
