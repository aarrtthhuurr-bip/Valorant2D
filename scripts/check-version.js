const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const packageVersion = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
).version;
const updatesVersion = JSON.parse(
  fs.readFileSync(path.join(root, 'updates.json'), 'utf8'),
).version;
const serviceWorker = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const checks = [
  [updatesVersion === packageVersion, 'updates.json'],
  [serviceWorker.includes(`valorant2d-shell-v${packageVersion}`), 'service-worker.js'],
  [index.includes(`game.js?v=${packageVersion}`), 'index.html: game.js'],
  [index.includes(`styles.css?v=${packageVersion}`), 'index.html: styles.css'],
  [index.includes(`manifest.webmanifest?v=${packageVersion}`), 'index.html: manifesto'],
];

const invalid = checks.filter(([valid]) => !valid).map(([, label]) => label);
if (invalid.length) {
  console.error(`Versão ${packageVersion} não está sincronizada em: ${invalid.join(', ')}.`);
  process.exitCode = 1;
} else {
  console.log(`Versão ${packageVersion} sincronizada.`);
}
