# Titan DigiStack

A fully hand-coded digital marketplace storefront. No CMS, no page builder, no JS frameworks, no CSS frameworks. Just HTML5, CSS3, and vanilla ES6+.

Stack:

- HTML5 with semantic landmarks
- CSS3 (custom properties, Grid, Flexbox)
- Vanilla JavaScript (modules split by concern, no build step)
- Google Fonts: Inter + Poppins (only external dependency)

---

## File structure

```text
titan-digistack/
├── index.html              # Homepage with all 8 category sections
├── css/
│   ├── style.css           # Tokens, reset, typography, utilities
│   ├── layout.css          # Header, footer, hero, sections, mobile nav
│   ├── components.css      # Buttons, badges, cards, tabs, search, sub-pages
│   └── responsive.css      # Mobile-first breakpoints (480, 640, 768, 1024, 1280)
├── js/
│   ├── main.js             # Catalog data + grid render + tabs + reveal + shop filters
│   ├── cart.js             # Cart state, localStorage, badge, cart-page rendering
│   ├── countdown.js        # Promo countdown (configurable end date)
│   └── search.js           # Live filter + dropdown with keyboard nav
├── assets/
│   ├── prime-logo.png      # Prime Logo (cube mark)
│   ├── company-banner.png   # Company Banner (Titan DigiStack)
│   └── icons/              # (Reserved for additional assets)
├── pages/
│   ├── shop.html           # Full catalog with filters + sort
│   ├── cart.html           # Cart with qty controls + WhatsApp checkout
│   └── contact.html        # Contact form + about/privacy/terms/refund policies
└── README.md
```

---

## Run it

It's a static site. Two options:

1. **Just open `index.html`** in any modern browser. Cart persistence, search, and the countdown all work from the file system.
2. **Local server** (recommended for clean URLs and to avoid edge cases):

   ```bash
   npx serve .
   # or
   python -m http.server 8080
   ```

---

## Customize

### Colors

All colors are CSS custom properties on `:root` in `css/style.css`:

```css
:root {
  --color-bg-primary:     #0d1117;
  --color-bg-secondary:   #161b27;
  --color-bg-card:        #1c2333;
  --color-accent-primary: #00c8ff;
  --color-accent-hover:   #0099cc;
  --color-text-primary:   #ffffff;
  --color-text-secondary: #a0aec0;
  --color-text-muted:     #6b7280;
  --color-border:         #2d3748;
  --color-price:          #48bb78;
  --color-badge-new:      #f6ad55;
  --color-badge-sale:     #fc8181;
  /* ... */
}
```

Change a single value here and it propagates everywhere.

### Products (add / edit / remove)

Every product lives in **one place**: the `PRODUCTS` array near the top of `js/main.js`.

```js
const PRODUCTS = [
  { id: 'th-001', title: 'Astra Pro WP Theme', price: 450, category: 'themes' },
  { id: 'pl-006', title: 'Elementor Pro',       price: 450, badge: 'sale', category: 'plugins' },
  { id: 'ai-008', title: 'ChatGPT Plus',        price: 350, category: 'ai' },
  // ...
];
```

Field reference:

| Field      | Type            | Required | Notes                                                                                        |
|------------|-----------------|----------|----------------------------------------------------------------------------------------------|
| `id`       | string          | yes      | Unique. Used as cart key.                                                                    |
| `title`    | string          | yes      | Displayed on the card.                                                                       |
| `price`    | number ⏐ `null` | yes      | BDT amount. Use `0` for "Free". Use `null` for "Call for Price".                             |
| `priceMax` | number          | no       | Renders `৳450–৳750` style price ranges.                                                      |
| `badge`    | string          | no       | One of: `'new'`, `'sale'`, `'free'`, `'call'`.                                               |
| `category` | string          | yes      | One of: `themes`, `plugins`, `graphic`, `ai`, `software`, `tutorials`, `services`, `ebooks`. |

Add a product → save → reload. The homepage grid, search dropdown, and shop page all pick it up automatically.

### Real product images

Drop image files into `assets/products/` named after the product `id`.
The site auto-detects them and tries **three extensions in order: `.png` → `.jpg` → `.webp`**.
You can mix formats freely — just use the product ID as the filename.

```text
assets/products/th-005.png    ← appears on the "Astra Pro WP Theme" card
assets/products/gr-018.jpg    ← "Canva Pro" — JPG is fine, picked up automatically
assets/products/ai-008.webp   ← "ChatGPT Plus" — WebP also works
```

No config changes needed. Missing files fall back through the chain silently, then
land on the gradient placeholder. No broken-image icons, no console errors.

#### Extension fallback order

`png` → `jpg` → `webp`

Each request only fires after the previous one fails, so only one network request
goes out for found images. The chain is defined in `main.js`:

```js
window.IMAGE_EXTS = ['png', 'jpg', 'webp'];
```

Change the order or add more extensions there if you need to.

**Recommended spec:** 480 × 580 px (matches the locked 240 × 290 card at 2× Retina).

**Per-product overrides** in `js/main.js`:

```js
// Custom filename or external URL (no fallback chain, single-shot):
{ id: 'th-005', /* ... */ image: 'assets/products/astra-pro-custom.jpg' }
{ id: 'th-009', /* ... */ image: 'https://cdn.example.com/divi.png' }

// Logos with whitespace look better centered + padded than edge-to-edge:
{ id: 'gr-018', /* ... */ imageFit: 'contain' }

// Force the placeholder even if a file exists:
{ id: 'sv-006', /* ... */ image: false }
```

A full filename checklist for all 129 products lives at `assets/products/README.md`.

### Countdown timer

Edit one line at the top of `js/countdown.js`:

```js
const END_DATE = '2026-12-31T23:59:59';
```

Format: `YYYY-MM-DDTHH:mm:ss` in the visitor's local time. Append `Z` for UTC. The offer banner auto-hides when the timer reaches zero.

### WhatsApp number, email, and contact endpoints

`js/main.js` exposes a config block at the top:

```js
window.STORE_CONFIG = {
  whatsappNumber: '16728952770',  // +1 (672) 895-2770 (E.164 without +)
  whatsappDisplay: '+1 (672) 895-2770',
  supportEmail:   'support@bdexchz.live',
  adminEmail:     'admin@bdexchz.live',
};
```

Update these — they drive every "Call for Price" CTA and the cart's WhatsApp checkout.

You'll also want to update the **hard-coded** WhatsApp/Telegram URLs in the footer of each HTML file (search for `wa.me/` and `t.me/`).

### Hero featured cards & section copy

Hero offer cards and category headlines are inline in `index.html`. They're labeled with comments matching the spec sections (1–16). Edit them directly.

---

## Deploy

The site is fully static. Pick any host:

### Netlify

1. Drag the `titan-digistack/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Done.
2. Or connect a Git repo: framework `none`, build command empty, publish directory `titan-digistack` (or `.` if the project is already at the repo root).

### Vercel

```bash
npx vercel
```

Choose "Other" framework. Output directory: `.`. No build command.

### GitHub Pages

1. Push the project to a repo.
2. Repo → Settings → Pages → Source: `main` branch, `/` (root) — or whichever folder contains `index.html`.
3. Save. Your site is live at `https://<user>.github.io/<repo>/`.

### Cloudflare Pages

Build command: empty. Output directory: project root. Deploys in seconds.

---

## What's customizable before going live

These five items are the only things that need real values:

1. `whatsappNumber`, `supportEmail`, and `adminEmail` in `js/main.js`
2. `END_DATE` in `js/countdown.js`
3. Social URLs in the footer of each HTML page (Facebook, YouTube, WhatsApp, Telegram)
4. The official business emails shown in the footer and contact desk (`support@bdexchz.live` & `admin@bdexchz.live`)
5. Real product images — drop files into `assets/products/` named `<product-id>.png`. See `assets/products/README.md` for the full filename checklist. Missing images fall back to placeholders automatically.

---

## Accessibility & performance notes

- Semantic landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`) throughout
- Visible `:focus-visible` outlines using the cyan accent
- Mobile nav uses focus management and `Escape` to close
- All icon-only buttons have `aria-label`
- Color contrast passes WCAG AA on all text/background pairs in the dark theme
- `prefers-reduced-motion` disables transitions and reveal animations
- Scripts use `defer`; no render-blocking JS in `<head>`
- Images would use `loading="lazy"` once swapped in (placeholders are inline SVG)
- `IntersectionObserver` powers scroll-reveal and category scroll-spy
- Cart sync across tabs via the `storage` event

Full WCAG conformance requires manual testing with assistive technologies and an expert accessibility audit beyond automated checks.

---

## License

The Titan DigiStack storefront code is yours to use and modify. Product names and prices listed in `PRODUCTS` are placeholders sourced from the build brief — verify the licensing of any third-party software you choose to resell through the storefront.
