const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const homePath = path.join(root, 'index.html');
let home = fs.readFileSync(homePath, 'utf8');

if (!home.includes('>TailoredITBD</')) {
  home = home.replace(
    /(<p class="text-uppercase" style="letter-spacing:\.2em">Luxury[\s\S]*?Comfort<\/p>)/,
    '<p>Made with <a href="https://tailoreditbd.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit TailoredITBD"><strong class="text-champagne-light">TailoredITBD</strong></a></p>\n      $1'
  );
  fs.writeFileSync(homePath, home, 'utf8');
}

const footerMatch = home.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
if (!footerMatch) throw new Error('Homepage footer not found.');
const homeFooter = footerMatch[0];

const generatedRoots = ['shop', 'about-us', 'service-area', 'blog'];
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(item) : [item];
  });
}

for (const folder of generatedRoots) {
  for (const file of walk(path.join(root, folder)).filter((item) => item.endsWith('.html'))) {
    const relative = path.relative(root, file).replace(/\\/g, '/');
    const prefix = '../'.repeat(relative.split('/').length - 1);
    const footer = homeFooter
      .replace(/(href|src)="(assets\/|index\.html|shop\/|blog\/|about-us\/|service-area\/)/g, `$1="${prefix}$2`)
      .replace(/href="#faq"/g, `href="${prefix}index.html#faq"`);

    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, footer);
    fs.writeFileSync(file, html, 'utf8');
  }
}

console.log('Applied the homepage footer and TailoredITBD credit across all inner pages.');
