const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceRoot = path.join(root, 'source-doc');

const pages = [
  ['shop/index.html', 'shop/index.html'],
  ['shop/category/womens-clothing-collection-in-bangladesh.html', 'shop/category/womens-clothing-collection-in-bangladesh.html'],
  ['shop/category/mens-fashion-in-bangladesh.html', 'shop/category/mens-fashion-in-bangladesh.html'],
  ['shop/category/boys-fashion-in-bangladesh.html', 'shop/category/boys-fashion-in-bangladesh.html'],
  ['shop/category/girls-clothing-in-bangladesh.html', 'shop/category/girls-clothing-in-bangladesh.html'],
  ['shop/category/seasonal-fashion-in-bangladesh.html', 'shop/category/seasonal-fashion-in-bangladesh.html'],
  ['shop/category/fashion-accessories-in-bangladesh.html', 'shop/category/fashion-accessories-in-bangladesh.html'],
  ['about/about-us.html', 'about-us/index.html'],
  ['about/mission-vision.html', 'about-us/mission-vision.html'],
  ['about/our-leadership-team.html', 'about-us/our-leadership-team.html'],
  ['about/affiliations.html', 'about-us/affiliations.html'],
  ['about/awards-and-achievements.html', 'about-us/awards-and-achievements.html'],
  ['about/certifications.html', 'about-us/certifications.html'],
  ['about/career-opportunity.html', 'about-us/career-opportunity.html'],
  ['about/contact-us.html', 'about-us/contact-us.html'],
  ['about/customer-reviews.html', 'about-us/customer-reviews.html'],
  ['about/testimonials.html', 'about-us/testimonials.html'],
  ['about/hours-location.html', 'about-us/hours-location.html'],
  ['service-area/index.html', 'service-area/index.html'],
  ['blog/index.html', 'blog/index.html'],
  ['blog/post/best-casual-outfits-for-bangladesh-summer.html', 'blog/post/best-casual-outfits-for-bangladesh-summer.html'],
  ['blog/post/how-to-buy-clothes-online-safely-in-bangladesh-a-complete-guide.html', 'blog/post/how-to-buy-clothes-online-safely-in-bangladesh-a-complete-guide.html']
];

const categories = [
  ['Women', 'womens-clothing-collection-in-bangladesh.html', 'cat-women.jpg'],
  ['Men', 'mens-fashion-in-bangladesh.html', 'cat-men.jpg'],
  ['Girls', 'girls-clothing-in-bangladesh.html', 'cat-girls.jpg'],
  ['Boys', 'boys-fashion-in-bangladesh.html', 'cat-boys.jpg'],
  ['Seasonal', 'seasonal-fashion-in-bangladesh.html', 'cat-seasonal.jpg'],
  ['Accessories', 'fashion-accessories-in-bangladesh.html', 'cat-accessories.jpg']
];

function stripTags(value) {
  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function plain(value) {
  return stripTags(value)
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&eacute;/g, 'é')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function attr(value) {
  return plain(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cleanInline(value) {
  return value
    .replace(/<br\s*\/?>/gi, '<br>')
    .replace(/<\/?span[^>]*>/gi, '')
    .replace(/<\/?(?!br\b)[^>]+>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSource(source) {
  const body = (source.match(/<body[^>]*>([\s\S]*?)<\/body>/i) || [])[1] || '';
  const allParagraphs = [...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => cleanInline(match[1]));
  const metaTitleRow = allParagraphs.find((row) => /^Meta Title:/i.test(plain(row)));
  const metaDescriptionRow = allParagraphs.find((row) => /^Meta Description:/i.test(plain(row)));
  const metaTitle = metaTitleRow ? plain(metaTitleRow).replace(/^Meta Title:\s*/i, '').trim() : 'Veanora';
  const metaDescription = metaDescriptionRow
    ? plain(metaDescriptionRow).replace(/^Meta Description:\s*/i, '').replace(/=+.*$/, '').trim()
    : 'Discover premium fashion, thoughtful design, and modern elegance at Veanora.';

  const tokens = [...body.matchAll(/<(h1|h2|h3|p|li)[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((match) => ({ tag: match[1].toLowerCase(), html: cleanInline(match[2]) }))
    .filter((token) => plain(token.html));

  const firstH1 = tokens.findIndex((token) => token.tag === 'h1');
  const content = tokens.slice(firstH1 < 0 ? 0 : firstH1);
  return { metaTitle, metaDescription, content };
}

function depthPrefix(output) {
  const depth = output.split('/').length - 1;
  return '../'.repeat(depth);
}

function pageType(output) {
  if (output === 'shop/index.html') return 'shop';
  if (output.includes('shop/category/')) return 'category';
  if (output === 'blog/index.html') return 'blog-index';
  if (output.includes('blog/post/')) return 'article';
  if (output === 'about-us/contact-us.html') return 'contact';
  if (output === 'about-us/career-opportunity.html') return 'career';
  if (output === 'about-us/index.html') return 'about';
  return 'editorial';
}

function heroImage(output) {
  if (output.includes('womens-')) return 'cat-women.jpg';
  if (output.includes('mens-')) return 'cat-men.jpg';
  if (output.includes('girls-')) return 'cat-girls.jpg';
  if (output.includes('boys-')) return 'cat-boys.jpg';
  if (output.includes('seasonal-')) return 'cat-seasonal.jpg';
  if (output.includes('accessories-')) return 'cat-accessories.jpg';
  if (output.includes('blog/')) return 'band-saree.jpg';
  if (output.includes('service-area')) return 'hero-3.jpg';
  return 'hero-1.jpg';
}

function sectionName(output) {
  if (output.startsWith('shop/')) return 'The collections';
  if (output.startsWith('blog/')) return 'The journal';
  if (output.startsWith('service-area/')) return 'Across Bangladesh';
  return 'The house of Veanora';
}

function crumbLabel(output) {
  if (output.startsWith('shop/')) return ['Shop', 'shop/index.html'];
  if (output.startsWith('blog/')) return ['Journal', 'blog/index.html'];
  if (output.startsWith('service-area/')) return ['Service area', 'service-area/index.html'];
  return ['About', 'about-us/index.html'];
}

function renderHeader(prefix) {
  return `<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header">
  <div class="promo-bar"><div class="container d-flex justify-content-between align-items-center py-2">
    <p class="promo-text mb-0">Complimentary style guidance · Delivery across Bangladesh</p>
    <a class="d-none d-sm-inline-flex align-items-center gap-2" href="tel:+8801715524744"><i class="bi bi-telephone"></i> +880 1715-524744</a>
  </div></div>
  <div class="header-main" id="headerMain">
    <div class="container masthead">
      <button class="icon-btn d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu" aria-label="Open menu"><i class="bi bi-list fs-4"></i></button>
      <a class="brand-lockup" href="${prefix}index.html" aria-label="Veanora home"><img src="${prefix}assets/img/veanora-logo.png" alt="Veanora" width="172" height="48"></a>
      <nav class="main-nav main-nav-refined d-none d-lg-block" aria-label="Primary">
        <ul>
          <li><a href="${prefix}shop/index.html">Shop</a></li>
          <li><a href="${prefix}shop/category/womens-clothing-collection-in-bangladesh.html">Women</a></li>
          <li><a href="${prefix}shop/category/mens-fashion-in-bangladesh.html">Men</a></li>
          <li><a href="${prefix}shop/category/seasonal-fashion-in-bangladesh.html">Seasonal</a></li>
          <li><a href="${prefix}blog/index.html">Journal</a></li>
          <li><a href="${prefix}about-us/index.html">Our story</a></li>
        </ul>
      </nav>
      <div class="masthead-tools">
        <button class="icon-btn" type="button" aria-label="Search"><i class="bi bi-search"></i></button>
        <a class="icon-btn" href="${prefix}about-us/contact-us.html" aria-label="Contact Veanora"><i class="bi bi-person"></i></a>
        <button class="icon-btn" type="button" aria-label="Shopping bag"><i class="bi bi-bag"></i><span class="cart-count">0</span></button>
      </div>
    </div>
  </div>
  <div class="offcanvas offcanvas-start offcanvas-veanora" tabindex="-1" id="mobileMenu">
    <div class="offcanvas-header border-bottom border-line"><img src="${prefix}assets/img/veanora-logo.png" alt="Veanora" width="140"><button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close menu"></button></div>
    <nav class="offcanvas-body p-0">
      <a class="nav-link-mobile" href="${prefix}index.html">Home</a>
      <a class="nav-link-mobile" href="${prefix}shop/index.html">Shop all</a>
      <a class="nav-link-mobile" href="${prefix}shop/category/womens-clothing-collection-in-bangladesh.html">Women</a>
      <a class="nav-link-mobile" href="${prefix}shop/category/mens-fashion-in-bangladesh.html">Men</a>
      <a class="nav-link-mobile" href="${prefix}shop/category/girls-clothing-in-bangladesh.html">Girls</a>
      <a class="nav-link-mobile" href="${prefix}shop/category/boys-fashion-in-bangladesh.html">Boys</a>
      <a class="nav-link-mobile" href="${prefix}blog/index.html">Journal</a>
      <a class="nav-link-mobile" href="${prefix}about-us/index.html">Our story</a>
      <a class="nav-link-mobile" href="${prefix}about-us/contact-us.html">Contact</a>
    </nav>
  </div>
</header>`;
}

function renderFooter(prefix) {
  return `<footer class="site-footer">
  <div class="container footer-editorial">
    <div class="footer-intro">
      <img src="${prefix}assets/img/veanora-logo.png" alt="Veanora" width="160">
      <p>Modern luxury shaped for life in Bangladesh—considered fabrics, graceful silhouettes, and service with care.</p>
      <div class="d-flex gap-2">
        <a class="social-round" href="https://instagram.com/veanoraofficial" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
        <a class="social-round" href="https://facebook.com/veanora.official" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
        <a class="social-round" href="https://wa.me/8801715524744" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
      </div>
    </div>
    <div><h2>Collections</h2><ul class="footer-list">
      <li><a href="${prefix}shop/category/womens-clothing-collection-in-bangladesh.html">Women</a></li>
      <li><a href="${prefix}shop/category/mens-fashion-in-bangladesh.html">Men</a></li>
      <li><a href="${prefix}shop/category/girls-clothing-in-bangladesh.html">Girls</a></li>
      <li><a href="${prefix}shop/category/boys-fashion-in-bangladesh.html">Boys</a></li>
      <li><a href="${prefix}shop/category/fashion-accessories-in-bangladesh.html">Accessories</a></li>
    </ul></div>
    <div><h2>Veanora</h2><ul class="footer-list">
      <li><a href="${prefix}about-us/index.html">Our story</a></li>
      <li><a href="${prefix}about-us/mission-vision.html">Mission &amp; vision</a></li>
      <li><a href="${prefix}about-us/career-opportunity.html">Careers</a></li>
      <li><a href="${prefix}service-area/index.html">Delivery areas</a></li>
      <li><a href="${prefix}blog/index.html">Journal</a></li>
    </ul></div>
    <div><h2>Private assistance</h2>
      <p><a href="tel:+8801715524744">+880 1715-524744</a><br><a href="mailto:veanora.official@gmail.com">veanora.official@gmail.com</a></p>
      <p>House 14, Road 14, Sector 12<br>Uttara, Dhaka 1230</p>
      <a class="footer-cta" href="${prefix}about-us/contact-us.html">Contact the house <i class="bi bi-arrow-right"></i></a>
    </div>
  </div>
  <div class="footer-bottom"><div class="container py-3 d-flex justify-content-between gap-3 flex-wrap"><p>© <span id="year">2026</span> Veanora. All rights reserved.</p><p>Luxury · Modesty · Comfort</p></div></div>
</footer>
<a class="wa-float" href="https://wa.me/8801715524744" target="_blank" rel="noopener" aria-label="Chat with Veanora on WhatsApp"><i class="bi bi-whatsapp"></i></a>
<button class="to-top" id="toTop" type="button" aria-label="Back to top"><i class="bi bi-arrow-up"></i></button>`;
}

function renderBodyTokens(tokens, prefix, type) {
  let html = '';
  let inList = false;
  let paragraphIndex = 0;
  for (const token of tokens.slice(1)) {
    const text = plain(token.html);
    if (!text || /^={5,}$/.test(text) || /^URL:/i.test(text) || /^\[note:/i.test(text)) continue;
    if (/^Button:/i.test(text)) {
      if (inList) { html += '</ul>'; inList = false; }
      const label = text.replace(/^Button:\s*/i, '');
      const isCall = /call/i.test(label);
      const isContact = /message|contact|form|expert/i.test(label);
      const href = isCall ? 'tel:+8801715524744' : isContact ? `${prefix}about-us/contact-us.html` : `${prefix}shop/index.html`;
      html += `<p class="content-cta"><a class="btn-luxe" href="${href}">${attr(label)} <i class="bi bi-arrow-right"></i></a></p>`;
      continue;
    }
    if (token.tag === 'li') {
      if (!inList) { html += '<ul class="editorial-list">'; inList = true; }
      html += `<li><i class="bi bi-check2"></i><span>${token.html}</span></li>`;
      continue;
    }
    if (inList) { html += '</ul>'; inList = false; }
    if (token.tag === 'h2') {
      html += `<h2>${token.html}</h2>`;
    } else if (token.tag === 'h3') {
      html += `<h3>${token.html}</h3>`;
    } else {
      const bulletText = text.includes('• ') ? text.split('|').map((item) => item.replace(/^•\s*/, '').trim()).filter(Boolean) : null;
      if (bulletText && bulletText.length > 1) {
        html += `<ul class="editorial-list">${bulletText.map((item) => `<li><i class="bi bi-check2"></i><span>${attr(item)}</span></li>`).join('')}</ul>`;
      } else {
        const lead = paragraphIndex < 2 && type !== 'article' ? ' class="lead-luxe"' : '';
        html += `<p${lead}>${token.html}</p>`;
        paragraphIndex += 1;
      }
    }
  }
  if (inList) html += '</ul>';
  return html;
}

function renderShopGrid(prefix, heading = 'Explore the collections') {
  return `<section class="section collection-navigation"><div class="container">
    <div class="section-heading-row"><div><p class="eyebrow">Curated for every life</p><h2>${heading}</h2></div><a href="${prefix}shop/index.html">View all <i class="bi bi-arrow-right"></i></a></div>
    <div class="luxury-grid">${categories.map(([name, url, image]) => `
      <a class="luxury-tile" href="${prefix}shop/category/${url}">
        <img src="${prefix}assets/img/${image}" alt="${name} fashion by Veanora" loading="lazy">
        <span class="luxury-tile-shade"></span><span class="luxury-tile-copy"><small>Discover</small><strong>${name}</strong><i class="bi bi-arrow-right"></i></span>
      </a>`).join('')}
    </div>
  </div></section>`;
}

function renderBlogCards(prefix) {
  return `<section class="section bg-ivory-deep"><div class="container">
    <div class="row g-4">
      <div class="col-md-6"><article class="journal-card"><a href="${prefix}blog/post/best-casual-outfits-for-bangladesh-summer.html"><img src="${prefix}assets/img/cat-seasonal.jpg" alt="Lightweight summer fashion" loading="lazy"></a><div><p class="eyebrow">Seasonal notes</p><h2><a href="${prefix}blog/post/best-casual-outfits-for-bangladesh-summer.html">Best casual outfits for summer in Bangladesh</a></h2><p>Breathable fabrics, effortless silhouettes, and ten outfit ideas made for warm, humid days.</p><a class="read-link" href="${prefix}blog/post/best-casual-outfits-for-bangladesh-summer.html">Read the story <i class="bi bi-arrow-right"></i></a></div></article></div>
      <div class="col-md-6"><article class="journal-card"><a href="${prefix}blog/post/how-to-buy-clothes-online-safely-in-bangladesh-a-complete-guide.html"><img src="${prefix}assets/img/product-saree.jpg" alt="Premium clothing details" loading="lazy"></a><div><p class="eyebrow">The shopping guide</p><h2><a href="${prefix}blog/post/how-to-buy-clothes-online-safely-in-bangladesh-a-complete-guide.html">How to buy clothes online safely in Bangladesh</a></h2><p>A considered guide to sizing, fabrics, secure payment, store policies, and confident online ordering.</p><a class="read-link" href="${prefix}blog/post/how-to-buy-clothes-online-safely-in-bangladesh-a-complete-guide.html">Read the story <i class="bi bi-arrow-right"></i></a></div></article></div>
    </div>
  </div></section>`;
}

function renderForm(type) {
  const career = type === 'career';
  return `<aside class="concierge-card">
    <p class="eyebrow">${career ? 'Join the house' : 'Private assistance'}</p>
    <h2>${career ? 'Introduce yourself' : 'How may we help?'}</h2>
    <p>${career ? 'Share your profile and our team will contact you when a suitable opportunity becomes available.' : 'Speak with our client care team for sizing, orders, delivery, returns, or collaborations.'}</p>
    <form class="concierge-form" action="#" method="post">
      <label>Full name<input type="text" name="name" autocomplete="name" required></label>
      <label>Email address<input type="email" name="email" autocomplete="email" required></label>
      <label>Phone number<input type="tel" name="phone" autocomplete="tel"></label>
      ${career ? '<label>Area of interest<select name="interest"><option>Fashion design</option><option>Marketing & content</option><option>E-commerce operations</option><option>Customer service</option><option>Other</option></select></label>' : '<label>Enquiry type<select name="enquiry"><option>Product & sizing</option><option>Order & delivery</option><option>Returns & exchange</option><option>Wholesale & collaboration</option><option>General enquiry</option></select></label>'}
      <label>Message<textarea name="message" rows="4" required></textarea></label>
      <button class="btn-luxe" type="submit">${career ? 'Submit profile' : 'Send enquiry'} <i class="bi bi-arrow-right"></i></button>
      <p class="form-note">This static preview does not transmit form data. Connect your preferred form service before launch.</p>
    </form>
  </aside>`;
}

function renderPage(sourceFile, outputFile) {
  const source = fs.readFileSync(path.join(sourceRoot, sourceFile), 'utf8');
  const data = parseSource(source);
  const type = pageType(outputFile);
  const prefix = depthPrefix(outputFile);
  const titleToken = data.content.find((token) => token.tag === 'h1');
  const title = titleToken ? plain(titleToken.html) : data.metaTitle;
  const canonicalPath = outputFile.endsWith('/index.html') ? outputFile.slice(0, -10) : outputFile;
  const canonical = `https://www.veanora.com/${canonicalPath}`;
  const [crumb, crumbPath] = crumbLabel(outputFile);
  const bodyContent = renderBodyTokens(data.content, prefix, type);
  const isForm = type === 'contact' || type === 'career';
  const articleClass = type === 'article' ? ' article-prose' : '';

  let afterContent = '';
  if (type === 'shop') afterContent = renderShopGrid(prefix);
  if (type === 'blog-index') afterContent = renderBlogCards(prefix);
  if (type === 'about') afterContent = renderShopGrid(prefix, 'A wardrobe for every chapter');
  if (type === 'category') afterContent = `<section class="closing-cta"><div class="container"><p class="eyebrow">The Veanora edit</p><h2>Wear it your way.</h2><p>For personal styling, sizing advice, or help completing your look, our client care team is here.</p><a class="btn-ghost-light" href="${prefix}about-us/contact-us.html">Speak with an advisor</a></div></section>`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${attr(data.metaTitle)} | Veanora</title>
  <meta name="description" content="${attr(data.metaDescription)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#12110f">
  <link rel="canonical" href="${canonical}">
  <meta property="og:site_name" content="Veanora">
  <meta property="og:type" content="${type === 'article' ? 'article' : 'website'}">
  <meta property="og:title" content="${attr(data.metaTitle)}">
  <meta property="og:description" content="${attr(data.metaDescription)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://www.veanora.com/assets/img/${heroImage(outputFile)}">
  <link rel="icon" href="${prefix}favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <link rel="stylesheet" href="${prefix}assets/css/style.css">
</head>
<body class="inner-page ${type}">
${renderHeader(prefix)}
<main id="main">
  <section class="inner-hero">
    <div class="inner-hero-media"><img src="${prefix}assets/img/${heroImage(outputFile)}" alt="" fetchpriority="high"><span></span></div>
    <div class="container inner-hero-copy">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${prefix}index.html">Home</a><i class="bi bi-chevron-right"></i><a href="${prefix}${crumbPath}">${crumb}</a>${title.toLowerCase() !== crumb.toLowerCase() ? `<i class="bi bi-chevron-right"></i><span aria-current="page">${attr(title)}</span>` : ''}</nav>
      <p class="eyebrow">${sectionName(outputFile)}</p>
      <h1>${titleToken ? titleToken.html : attr(title)}</h1>
      <span class="hero-rule"></span>
    </div>
  </section>
  <section class="content-section">
    <div class="container ${isForm ? 'content-with-aside' : ''}">
      <article class="editorial-content${articleClass}">
        ${type === 'article' ? '<p class="article-meta"><span>Veanora editorial</span><span>12 min read</span></p>' : ''}
        ${bodyContent}
      </article>
      ${isForm ? renderForm(type) : ''}
    </div>
  </section>
  ${afterContent}
</main>
${renderFooter(prefix)}
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${prefix}assets/js/main.js"></script>
</body>
</html>
`;

  const outputPath = path.join(root, outputFile);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`Built ${outputFile}`);
}

for (const [source, output] of pages) renderPage(source, output);
