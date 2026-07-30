const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const excluded = new Set(['source-doc']);
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && excluded.has(entry.name)) return [];
    const item = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(item) : [item];
  });
}

const htmlFiles = walk(root).filter((file) => file.endsWith('.html'));
const errors = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) errors.push(`${relative}: expected 1 h1, found ${h1Count}`);
  if (!/<meta name="description"/i.test(html)) errors.push(`${relative}: missing meta description`);
  if (!/<meta name="viewport"/i.test(html)) errors.push(`${relative}: missing viewport`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/gi)) {
    const target = match[1].split('#')[0].split('?')[0];
    if (!target || /^(?:https?:|mailto:|tel:|data:|#)/i.test(target)) continue;
    const resolved = path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolved)) errors.push(`${relative}: broken local reference ${match[1]}`);
  }
}
console.log(`Validated ${htmlFiles.length} HTML files.`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('No structural or local-reference errors found.');
}
