// Builds the website's cover wall from finished album folders: each front cover becomes a 560 px JPEG
// under site/assets/art/wall, and wall.json lists title and artist for the captions.
// Run: node site/tools/make-wall.mjs "E:\path\to\album folders"
import { chromium } from 'playwright';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const source = process.argv[2];
if (!source) throw new Error('Give the folder that holds the album folders.');
const out = path.join(root, 'site', 'assets', 'art', 'wall');
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
const wall = [];
for (const folder of (await readdir(source, { withFileTypes: true })).filter(d => d.isDirectory())) {
  const dir = path.join(source, folder.name);
  let manifest, png;
  try { manifest = JSON.parse(await readFile(path.join(dir, 'album-package.json'), 'utf8')); png = await readFile(path.join(dir, 'front-cover.png')); }
  catch { continue; }
  const slug = folder.name.toLowerCase().replace(/ - [0-9a-f]{8}$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const jpeg = await page.evaluate(async ([data, size]) => {
    const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
    canvas.getContext('2d').drawImage(image, 0, 0, size, size);
    return canvas.toDataURL('image/jpeg', 0.82).split(',')[1];
  }, [png.toString('base64'), 560]);
  await writeFile(path.join(out, `${slug}.jpg`), Buffer.from(jpeg, 'base64'));
  wall.push({ file: `${slug}.jpg`, title: manifest.title, artist: manifest.artist?.name || '', tracks: manifest.tracks?.length || 0 });
}
await browser.close();
await writeFile(path.join(out, 'wall.json'), JSON.stringify(wall, null, 2) + '\n');
console.log(wall.map(w => `${w.file}: ${w.title} — ${w.artist} (${w.tracks})`).join('\n'));
