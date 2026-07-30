# Veanora — Static Homepage (HTML5 · CSS3 · Bootstrap 5 · Vanilla JS)

Pixel-for-pixel static rebuild of the Veanora luxury homepage, ready to deploy on **GitHub Pages**.

## Structure

```
static-site/
├── index.html          # full homepage (semantic HTML5 + SEO meta + JSON-LD)
├── 404.html            # GitHub Pages 404 page
├── robots.txt
├── sitemap.xml
├── favicon.ico
├── .nojekyll
└── assets/
    ├── css/style.css   # design system (ivory / champagne gold / ink black)
    ├── js/main.js      # sticky header, cart demo, back-to-top, GA4 events
    └── img/*.jpg|png   # all imagery + logo
```

No build step. Bootstrap 5.3 and Bootstrap Icons load from CDN.

## Deploy to GitHub Pages

1. Create a repo (e.g. `veanora`) and push the **contents** of `static-site/` to the repo root (or the `docs/` folder).
2. Settings → Pages → Source: `Deploy from a branch` → branch `main`, folder `/ (root)`.
3. Add your custom domain `www.veanora.com` under Settings → Pages → Custom domain (creates a `CNAME` file), then enable **Enforce HTTPS**.

## Before going live — replace these placeholders

| Placeholder | Where | Replace with |
|---|---|---|
| `GTM-XXXXXXX` | `index.html` head + `<noscript>` | Google Tag Manager container ID |
| `G-XXXXXXXXXX` | `index.html` head (2×) | GA4 Measurement ID |
| `CLARITY_ID` | `index.html` head | Microsoft Clarity project ID |
| `GOOGLE_SEARCH_CONSOLE_TOKEN` | `index.html` head | GSC HTML-tag verification token |
| `BING_WEBMASTER_TOKEN` | `index.html` head | Bing Webmaster verification token |
| `https://www.veanora.com/` | canonical, og:url, JSON-LD, sitemap, robots | your live domain if different |

## SEO already implemented

- Unique `<title>` (57 chars) + meta description (<160 chars), keywords, author, robots directives
- Canonical URL, Open Graph, Twitter Card, geo meta for Dhaka/Bangladesh
- Single `<h1>`, ordered `h2`/`h3` hierarchy, semantic `header/nav/main/section/article/figure/address/footer`
- `strong`, `b`, `blockquote` + `cite` for content emphasis and attribution
- Descriptive `alt` text on every image, width/height to avoid CLS, `loading="lazy"` + `fetchpriority="high"` on the LCP hero
- Schema.org JSON-LD `@graph`: Organization, WebSite (+SearchAction), ClothingStore (NAP, hours, map), BreadcrumbList, FAQPage
- `robots.txt` with sitemap directive and `sitemap.xml` with image extension
- Accessibility: skip link, ARIA labels, visible focus rings, reduced-motion support

## Off-page SEO signals wired in

All official profiles are linked in the header, footer and `sameAs` array:
Facebook, Instagram, YouTube, LinkedIn, WhatsApp, Messenger, Google Maps.

## Contact (NAP consistency)

**Veanora** — Uttara, Dhaka, Bangladesh, 1230
Phone/WhatsApp: +8801712120163 · Email: info@tailoreditbd.com
