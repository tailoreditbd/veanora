const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const homePath = path.join(root, 'index.html');
let home = fs.readFileSync(homePath, 'utf8');

home = home
  .replace(
    '<link rel="icon" href="favicon.ico" sizes="any">',
    '<link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="assets/img/favicon/favicon-16x16.png">'
  )
  .replace(
    '<link rel="apple-touch-icon" href="assets/img/veanora-logo.png">',
    '<link rel="apple-touch-icon" sizes="180x180" href="assets/img/favicon/favicon-180x180.png">'
  )
  .replace(
    'alt="Model wearing an ivory silk Veanora saree in an editorial setting"',
    'alt="Ivory and gold Veanora luxury saree displayed in an editorial studio"'
  )
  .replace(
    'alt="Draped luxury saree and abaya styling for Veanora"',
    'alt="Black Veanora luxury borkha displayed in an editorial studio"'
  )
  .replace(
    'alt="Veanora family fashion for women, men, girls and boys"',
    'alt="Woman wearing a luxury Veanora khimar and abaya"'
  );
fs.writeFileSync(homePath, home, 'utf8');

const headerMatch = home.match(/<header class="site-header">[\s\S]*?<\/header>/);
if (!headerMatch) throw new Error('Homepage header not found.');
const homeHeader = headerMatch[0];

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
    const header = homeHeader
      .replace(/(href|src)="(assets\/|index\.html|shop\/|blog\/|about-us\/|service-area\/)/g, `$1="${prefix}$2`);

    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/<header class="site-header">[\s\S]*?<\/header>/, header);
    html = html
      .replace(
        /<link rel="icon" href="[^"]*favicon\.ico">/,
        `<link rel="icon" type="image/png" sizes="32x32" href="${prefix}assets/img/favicon/favicon-32x32.png">\n  <link rel="icon" type="image/png" sizes="16x16" href="${prefix}assets/img/favicon/favicon-16x16.png">\n  <link rel="apple-touch-icon" sizes="180x180" href="${prefix}assets/img/favicon/favicon-180x180.png">`
      );
    fs.writeFileSync(file, html, 'utf8');
  }
}

console.log('Applied the homepage header and updated favicons across all inner pages.');
