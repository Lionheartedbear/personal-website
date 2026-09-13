import assert from 'node:assert/strict';
import { readdir, readFile, rm } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
const figures = JSON.parse(await readFile(new URL('src/content/event-time-volatility/figures.json', root), 'utf8'));
const publicAssets = new Set([
  'favicon.svg', 'robots.txt', 'images/portrait.jpg', 'resume/Wangdong-Jia-Resume.pdf',
  ...Object.values(figures).map(({ src }) => src.slice(1)),
]);
const expected = new Set(['index.html', 'projects/event-time-volatility/index.html', ...publicAssets]);
const seen = new Set();
let stylesheets = 0;

async function inspect(directory, prefix = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = new URL(entry.name, directory);
    const relative = `${prefix}${entry.name}`;
    // Finder can recreate these ignored files between builds. Never ship them.
    if (entry.name === '.DS_Store' && entry.isFile()) {
      await rm(file);
      continue;
    }
    if (entry.isDirectory()) {
      assert.ok([...expected].some((path) => path.startsWith(`${relative}/`)) || relative === '_astro',
        `Unexpected public directory: ${relative}`);
      await inspect(new URL(`${entry.name}/`, directory), `${relative}/`);
      continue;
    }
    assert.ok(entry.isFile(), `Unexpected public entry: ${relative}`);
    const stylesheet = /^_astro\/[\w.-]+\.css$/.test(relative);
    assert.ok(expected.has(relative) || stylesheet, `Unexpected public file: ${relative}`);
    seen.add(relative);
    if (stylesheet) stylesheets++;
    const bytes = await readFile(file);
    if (publicAssets.has(relative)) {
      assert.deepEqual(bytes, await readFile(new URL(`public/${relative}`, root)), `Public asset differs: ${relative}`);
    }
    if (/\.(?:html|css|svg|txt)$/.test(relative)) {
      assert.doesNotMatch(bytes.toString(), /\/Users\/|localhost|127\.0\.0\.1|Lionheartedbear|event-time-fx-volatility|sourceMappingURL|noindex|nofollow/i,
        `Development trace or indexing restriction: ${relative}`);
    }
  }
}

await inspect(output);
for (const path of expected) assert.ok(seen.has(path), `Missing public file: ${path}`);
assert.ok(stylesheets > 0, 'Missing production stylesheet');
console.log(`Verified ${seen.size} intentional public files; public assets byte-identical; no development files, source maps, or unexpected bundles.`);
