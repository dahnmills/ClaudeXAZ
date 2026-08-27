// ng-packagr refuses to copy assets from outside its project root (the
// library project root is src/app/shared/ui, but the tokens live in
// src/styles) — so the tokens are copied here, after the ng-packagr build,
// with a plain fs copy instead of ng-package.json's "assets" option.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src', 'styles');
const DEST = path.join(__dirname, '..', 'dist', 'design-system-lib', 'styles');

fs.mkdirSync(DEST, { recursive: true });

for (const file of fs.readdirSync(SRC)) {
  if (!file.endsWith('.scss')) continue;
  fs.copyFileSync(path.join(SRC, file), path.join(DEST, file));
  console.log(`Copied ${file} -> dist/design-system-lib/styles/${file}`);
}
