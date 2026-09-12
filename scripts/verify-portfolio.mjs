import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const content = new URL('src/content/event-time-volatility/', root);
const manifest = JSON.parse(await readFile(new URL('manifest.json', content), 'utf8'));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
assert.equal(manifest.asset_count, 17);
assert.equal(manifest.assets.length, 17);

for (const [path, expected] of Object.entries(manifest.outputs_sha256)) {
  const relative = path.replace(/^portfolio\//, '');
  const local = relative.startsWith('assets/')
    ? new URL(`public/projects/event-time-volatility/${relative.slice(7)}`, root)
    : new URL(relative, content);
  assert.equal(hash(await readFile(local)), expected, `Frozen content changed: ${relative}`);
}

const figures = JSON.parse(await readFile(new URL('figures.json', content), 'utf8'));
assert.equal(Object.keys(figures).length, 17);
const report = await readFile(new URL('project-report.md', content), 'utf8');
const reportAlt = new Map([...report.matchAll(/!\[([^\]]+)\]\(assets\/([^)]+)\)/g)].map(([, alt, path]) => [path, alt]));
const page = await readFile(new URL('src/pages/projects/event-time-volatility.astro', root), 'utf8');
for (const [key, figure] of Object.entries(figures)) {
  const relative = figure.src.replace('/projects/event-time-volatility/', '');
  const item = manifest.assets.find((entry) => entry.destination_path === `portfolio/assets/${relative}`);
  assert.ok(item, `Unapproved figure: ${figure.src}`);
  assert.equal(figure.alt, reportAlt.get(relative), `Alt text differs from report: ${key}`);
  assert.ok(page.includes(`figures.${key}`), `Figure is not integrated: ${key}`);
  const bytes = await readFile(new URL(`public${figure.src}`, root));
  assert.equal(hash(bytes), item.sha256, `Figure bytes changed: ${key}`);
  const viewBox = bytes.toString().match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  assert.ok(Math.abs(figure.width / figure.height - viewBox[2] / viewBox[3]) < 1e-9, `Aspect ratio changed: ${key}`);
}

console.log('Verified 21 frozen output hashes, all 17 SVG integrations, original alt text, and figure aspect ratios.');
