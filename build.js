const { mkdirSync, copyFileSync } = require('node:fs');
const { join } = require('node:path');
mkdirSync(join(__dirname, 'public'), { recursive: true });
for (const file of ['index.html', 'style.css', 'eye.js', 'script.js', 'favicon.svg']) {
  copyFileSync(join(__dirname, file), join(__dirname, 'public', file));
}
