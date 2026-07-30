const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const homePath = path.join(root, 'index.html');
let home = fs.readFileSync(homePath, 'utf8');

const replacements = new Map([
  ['+8801712120163', '+8801715524744'],
  ['+880 1712-120163', '+880 1715-524744'],
  ['info@tailoreditbd.com', 'veanora.official@gmail.com'],
  ['Uttara, Dhaka, Bangladesh, 1230', 'House 14, Road 14, Sector 12, Uttara, Dhaka 1230'],
  ['<li><a href="#new-arrivals">New Arrivals</a></li>', '<li><a href="shop/index.html">Shop</a></li>'],
  ['<li><a href="#collections">Women</a></li>', '<li><a href="shop/category/womens-clothing-collection-in-bangladesh.html">Women</a></li>'],
  ['<li><a href="#collections">Men</a></li>', '<li><a href="shop/category/mens-fashion-in-bangladesh.html">Men</a></li>'],
  ['<li><a href="#collections">Girls</a></li>', '<li><a href="shop/category/girls-clothing-in-bangladesh.html">Girls</a></li>'],
  ['<li><a href="#collections">Boys</a></li>', '<li><a href="shop/category/boys-fashion-in-bangladesh.html">Boys</a></li>'],
  ['<li><a href="#saree-abaya">Sarees</a></li>', '<li><a href="shop/category/womens-clothing-collection-in-bangladesh.html">Sarees</a></li>'],
  ['<li><a href="#saree-abaya">Abayas</a></li>', '<li><a href="shop/category/womens-clothing-collection-in-bangladesh.html">Abayas</a></li>'],
  ['<li><a href="#collections">Accessories</a></li>', '<li><a href="shop/category/fashion-accessories-in-bangladesh.html">Accessories</a></li>'],
  ['<li><a href="#faq">Blog</a></li>', '<li><a href="blog/index.html">Journal</a></li>'],
  ['<a class="nav-link-mobile" href="#new-arrivals" data-bs-dismiss="offcanvas">New Arrivals</a>', '<a class="nav-link-mobile" href="shop/index.html">Shop all</a>'],
  ['<a class="nav-link-mobile" href="#collections" data-bs-dismiss="offcanvas">Women</a>', '<a class="nav-link-mobile" href="shop/category/womens-clothing-collection-in-bangladesh.html">Women</a>'],
  ['<a class="nav-link-mobile" href="#collections" data-bs-dismiss="offcanvas">Men</a>', '<a class="nav-link-mobile" href="shop/category/mens-fashion-in-bangladesh.html">Men</a>'],
  ['<a class="nav-link-mobile" href="#collections" data-bs-dismiss="offcanvas">Girls</a>', '<a class="nav-link-mobile" href="shop/category/girls-clothing-in-bangladesh.html">Girls</a>'],
  ['<a class="nav-link-mobile" href="#collections" data-bs-dismiss="offcanvas">Boys</a>', '<a class="nav-link-mobile" href="shop/category/boys-fashion-in-bangladesh.html">Boys</a>'],
  ['<a class="nav-link-mobile" href="#saree-abaya" data-bs-dismiss="offcanvas">Sarees</a>', '<a class="nav-link-mobile" href="shop/category/womens-clothing-collection-in-bangladesh.html">Sarees</a>'],
  ['<a class="nav-link-mobile" href="#saree-abaya" data-bs-dismiss="offcanvas">Abayas</a>', '<a class="nav-link-mobile" href="shop/category/womens-clothing-collection-in-bangladesh.html">Abayas</a>'],
  ['<a class="nav-link-mobile" href="#collections" data-bs-dismiss="offcanvas">Accessories</a>', '<a class="nav-link-mobile" href="shop/category/fashion-accessories-in-bangladesh.html">Accessories</a>'],
  ['<a class="nav-link-mobile" href="#faq" data-bs-dismiss="offcanvas">Blog</a>', '<a class="nav-link-mobile" href="blog/index.html">Journal</a>']
]);

for (const [from, to] of replacements) home = home.split(from).join(to);
fs.writeFileSync(homePath, home, 'utf8');

const sitePages = [
  ['', '1.0'],
  ['shop/', '0.9'],
  ['shop/category/womens-clothing-collection-in-bangladesh.html', '0.9'],
  ['shop/category/mens-fashion-in-bangladesh.html', '0.9'],
  ['shop/category/girls-clothing-in-bangladesh.html', '0.8'],
  ['shop/category/boys-fashion-in-bangladesh.html', '0.8'],
  ['shop/category/seasonal-fashion-in-bangladesh.html', '0.8'],
  ['shop/category/fashion-accessories-in-bangladesh.html', '0.8'],
  ['about-us/', '0.7'],
  ['about-us/mission-vision.html', '0.6'],
  ['about-us/our-leadership-team.html', '0.6'],
  ['about-us/affiliations.html', '0.5'],
  ['about-us/awards-and-achievements.html', '0.5'],
  ['about-us/certifications.html', '0.5'],
  ['about-us/career-opportunity.html', '0.6'],
  ['about-us/contact-us.html', '0.8'],
  ['about-us/customer-reviews.html', '0.6'],
  ['about-us/testimonials.html', '0.6'],
  ['about-us/hours-location.html', '0.7'],
  ['service-area/', '0.7'],
  ['blog/', '0.8'],
  ['blog/post/best-casual-outfits-for-bangladesh-summer.html', '0.7'],
  ['blog/post/how-to-buy-clothes-online-safely-in-bangladesh-a-complete-guide.html', '0.7']
];
const date = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitePages.map(([url, priority]) => `  <url>
    <loc>https://www.veanora.com/${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${url.startsWith('blog') ? 'monthly' : 'weekly'}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap, 'utf8');
console.log(`Refined homepage and wrote ${sitePages.length} sitemap entries.`);
