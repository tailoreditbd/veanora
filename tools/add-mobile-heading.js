const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const generatedRoots = ['shop', 'about-us', 'service-area', 'blog'];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(item) : [item];
  });
}

for (const folder of generatedRoots) {
  for (const file of walk(path.join(root, folder)).filter((item) => item.endsWith('.html'))) {
    let html = fs.readFileSync(file, 'utf8');
    if (!html.includes('assets/css/mobile-heading.css')) {
      html = html.replace(
        /<link rel="stylesheet" href="([^"]*assets\/css\/)fixes\.css">/,
        '<link rel="stylesheet" href="$1fixes.css">\n  <link rel="stylesheet" href="$1mobile-heading.css">'
      );
      fs.writeFileSync(file, html, 'utf8');
    }
  }
}
