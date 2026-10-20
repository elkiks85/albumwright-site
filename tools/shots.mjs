// Full-page and section screenshots of the site for design review.
// Run: node site/tools/shots.mjs <out-dir> [width]
import { chromium } from 'playwright';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const [out = path.join(root, 'test-output', 'site-shots'), width = '1440'] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
await page.goto(pathToFileURL(path.join(root, 'site', 'index.html')).href);
await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important} .wall-track{animation:none!important} .meter::after{animation:none!important}' });
await page.evaluate(() => Promise.all([...document.images].map(img => { img.loading = 'eager'; return img.complete ? null : new Promise(done => { img.onload = img.onerror = done; }); })));
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(out, `index-${width}.png`), fullPage: true });
const height = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0, i = 1; y < height; y += 1600, i++) {
  await page.screenshot({ path: path.join(out, `index-${width}-part${i}.png`), fullPage: true, clip: { x: 0, y, width: Number(width), height: Math.min(1600, height - y) } });
}
console.log(`${out}: index at ${width}px, ${Math.ceil(height / 1600)} parts, ${height}px tall`);
await browser.close();
