const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const packageVersion = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
).version;
const updates = JSON.parse(
  fs.readFileSync(path.join(root, 'updates.json'), 'utf8'),
);
const updatesVersion = updates.version;
const serviceWorker = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const checks = [
  [updatesVersion === packageVersion, 'updates.json'],
  [serviceWorker.includes(`valorant2d-shell-v${packageVersion}`), 'service-worker.js'],
  [index.includes(`valorant2d-version" content="${packageVersion}`), 'index.html: meta de versão'],
  [index.includes(`version-manager.js?v=${packageVersion}`), 'index.html: gerenciador de versão'],
  [index.includes(`game.js?v=${packageVersion}`), 'index.html: game.js'],
  [index.includes(`styles.css?v=${packageVersion}`), 'index.html: styles.css'],
  [index.includes(`manifest.webmanifest?v=${packageVersion}`), 'index.html: manifesto'],
  [["draft", "published"].includes(updates.status), 'updates.json: status'],
  [Array.isArray(updates.highlights) && updates.highlights.length > 0, 'updates.json: alterações'],
];

if (updates.status === 'published') {
  checks.push(
    [!packageVersion.includes('-dev.'), 'package.json: versão pública'],
    [updates.channel === 'stable', 'updates.json: canal público'],
    [Boolean(updates.publishedAt), 'updates.json: data de publicação'],
  );
}

const invalid = checks.filter(([valid]) => !valid).map(([, label]) => label);
if (invalid.length) {
  console.error(`Versão ${packageVersion} não está sincronizada em: ${invalid.join(', ')}.`);
  process.exitCode = 1;
} else {
  console.log(`Versão ${packageVersion} sincronizada.`);
}
