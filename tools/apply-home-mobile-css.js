const fs = require('fs');
const path = require('path');

const homePath = path.resolve(__dirname, '..', 'index.html');
let html = fs.readFileSync(homePath, 'utf8');
if (!html.includes('assets/css/home-mobile.css')) {
  html = html.replace(
    '<link rel="stylesheet" href="assets/css/style.css">',
    '<link rel="stylesheet" href="assets/css/style.css">\n<link rel="stylesheet" href="assets/css/home-mobile.css">'
  );
  fs.writeFileSync(homePath, html, 'utf8');
}
