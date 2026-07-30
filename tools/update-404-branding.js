const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', '404.html');
let html = fs.readFileSync(file, 'utf8');
html = html.replace(
  '<link rel="icon" href="favicon.ico">',
  '<link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="assets/img/favicon/favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="assets/img/favicon/favicon-180x180.png">'
);
fs.writeFileSync(file, html, 'utf8');
