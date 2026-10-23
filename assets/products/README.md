# Product Images — Drop-In Folder

Drop image files here named after the product `id`.
The site tries **three extensions automatically: `.png` then `.jpg` then `.webp`**.
You can mix formats freely — just use the product ID as the filename stem.

```
th-005.png     <- tried first for "Astra Pro WP Theme"
gr-018.jpg     <- fine; site tries .png (404), then .jpg (found)
ai-008.webp    <- fine; site tries .png (404), .jpg (404), then .webp (found)
```

Missing files fall back silently to the gradient placeholder — no broken-image icons,
no console errors. Roll images out one at a time and everything else stays intact.

**Recommended size:** 480 x 580 px (2x the locked 240x290 card, sharp on Retina)

**Default fit:** `cover` — great for screenshots, banners, and product mockups.
For transparent logos set `imageFit: 'contain'` on that product in `js/main.js`:

```js
{ id: 'gr-018', title: 'Canva Pro', price: 60, category: 'graphic', imageFit: 'contain' }
```

**Other per-product overrides:**

```js
// Custom filename or external URL (single-shot, no fallback chain):
{ id: 'th-005', /* ... */ image: 'assets/products/astra-pro.jpg' }
{ id: 'th-009', /* ... */ image: 'https://cdn.example.com/divi.png' }

// Force the placeholder (ignore any file in this folder):
{ id: 'sv-006', /* ... */ image: false }
```

**Change the extension order** (edit `js/main.js`):
```js
window.IMAGE_EXTS = ['png', 'jpg', 'webp'];  // change order or add extensions here
```

---

## Filename checklist (129 products)

Copy this list as a checklist while you collect artwork. Each line is one
expected file. Tick them off as you drop images in.

### WordPress Themes — 15
- [ ] th-001.png — Digital Product Selling Website Template
- [ ] th-002.png — KitNinja – Ultimate Ecommerce Template
- [ ] th-003.png — 100+ Bangla Landing Page Templates
- [ ] th-004.png — 1000+ Elementor Landing Page Templates
- [ ] th-005.png — Astra Pro WP Theme
- [ ] th-006.png — GeneratePress Premium
- [ ] th-007.png — Rishi Theme Agency Pack Lifetime
- [ ] th-008.png — OceanWP Theme Premium
- [ ] th-009.png — Divi WordPress Theme
- [ ] th-010.png — Zakra Theme Lifetime
- [ ] th-011.png — Kadence Theme
- [ ] th-012.png — XStore WordPress Theme
- [ ] th-013.png — Woodmart WordPress Theme
- [ ] th-014.png — GPL WordPress Theme & Plugin Membership
- [ ] th-015.png — Woostify Theme Lifetime

### WordPress Plugins — 30
- [ ] pl-001.png — ACF Pro
- [ ] pl-002.png — All-in-One WP Migration Unlimited
- [ ] pl-003.png — bKash Sandbox API Test Plugin
- [ ] pl-004.png — Cartflows Pro License
- [ ] pl-005.png — Elementor Agency One Plan
- [ ] pl-006.png — Elementor Pro
- [ ] pl-007.png — ElementsKit Premium
- [ ] pl-008.png — EWWW Image Optimizer
- [ ] pl-009.png — Happy Addons for Elementor
- [ ] pl-010.png — Hide My WP Ghost
- [ ] pl-011.png — Imagify API Image Optimization
- [ ] pl-012.png — JetFormBuilder PRO
- [ ] pl-013.png — JetPlugins by Crocoblock
- [ ] pl-014.png — Ninja Tables
- [ ] pl-015.png — Perfmatters Plugin
- [ ] pl-016.png — Piotnet Addons For Elementor
- [ ] pl-017.png — PixelYourSite Pro
- [ ] pl-018.png — PowerPack Addons for Elementor
- [ ] pl-019.png — Premium Addons Pro for Elementor
- [ ] pl-020.png — Rank Math Pro
- [ ] pl-021.png — Royal Elementor Addons
- [ ] pl-022.png — ShopEngine – WooCommerce Builder
- [ ] pl-023.png — The Plus Addons For Elementor
- [ ] pl-024.png — Tutor LMS
- [ ] pl-025.png — Unlimited Addons for Elementor
- [ ] pl-026.png — WCFM Marketplace
- [ ] pl-027.png — WooLentor Elementor Addon
- [ ] pl-028.png — WP All Import and Export Plugin
- [ ] pl-029.png — WP Encryption SSL Solution
- [ ] pl-030.png — WP Funnels Pro

### Graphic Tools — 20
- [ ] gr-001.png — 20,000+ PSD & CDR Flyer Templates
- [ ] gr-002.png — Freepik Official Subscription
- [ ] gr-003.png — Runway ML Subscription
- [ ] gr-004.png — Midjourney AI Subscription
- [ ] gr-005.png — Recraft AI Subscription & Credits
- [ ] gr-006.png — Ideogram AI
- [ ] gr-007.png — ElevenLabs Creator Plan
- [ ] gr-008.png — Taja AI – Video Content Automation
- [ ] gr-009.png — HeyGen Official Subscription
- [ ] gr-010.png — InVideo Official Subscription
- [ ] gr-011.png — JoggAI – AI Video Generator
- [ ] gr-012.png — Envato Elements Subscription
- [ ] gr-013.png — Filmora 14 Lifetime
- [ ] gr-014.png — Adobe Creative Cloud Official
- [ ] gr-015.png — CapCut Pro
- [ ] gr-016.png — Google AI Pro (Gemini Veo 3)
- [ ] gr-017.png — Canva Premium
- [ ] gr-018.png — Canva Pro
- [ ] gr-019.png — Adobe Master Collection 2025
- [ ] gr-020.png — Adobe Master Collection 2024

### AI Tools & Subscriptions — 30
- [ ] ai-001.png — Higgsfield AI – Video & Image Generator
- [ ] ai-002.png — Beautiful AI
- [ ] ai-003.png — Bolt AI Builder
- [ ] ai-004.png — Branalyzer AI – Brand Analysis
- [ ] ai-005.png — LinkedIn Premium
- [ ] ai-006.png — Spotify Premium
- [ ] ai-007.png — ChatGPT Go
- [ ] ai-008.png — ChatGPT Plus
- [ ] ai-009.png — ChatPRD AI
- [ ] ai-010.png — Claude AI and API
- [ ] ai-011.png — ClickUp AI
- [ ] ai-012.png — Cloud AI Pro
- [ ] ai-013.png — CorelDRAW Subscription
- [ ] ai-014.png — Coursera Plus
- [ ] ai-015.png — DataCamp Subscription
- [ ] ai-016.png — Descript – AI Video Editing
- [ ] ai-017.png — Devin AI
- [ ] ai-018.png — Duolingo Subscription
- [ ] ai-019.png — Figma Professional Plan
- [ ] ai-020.png — Fireflies AI
- [ ] ai-021.png — FlexClip AI
- [ ] ai-022.png — Flutterflow Subscription
- [ ] ai-023.png — Foxly URL Shortener
- [ ] ai-024.png — Gamma AI – Presentation Builder
- [ ] ai-025.png — GitHub Pro / Team / Enterprise
- [ ] ai-026.png — Grammarly Premium
- [ ] ai-027.png — Gravitec Push Notifications
- [ ] ai-028.png — Grok AI SuperGrok
- [ ] ai-029.png — Group Buy SEO Tools
- [ ] ai-030.png — Gumloop AI Automation

### Software & Apps — 12
- [ ] sw-001.png — Truecaller Premium (Android & iOS)
- [ ] sw-002.png — Microsoft Office Professional 2019/2021/2024
- [ ] sw-003.png — Microsoft Office Professional 2010/2013/2016
- [ ] sw-004.png — Microsoft Office 365 – Lifetime
- [ ] sw-005.png — FastStone Capture – Official License
- [ ] sw-006.png — Fast Screen Recorder – Lifetime
- [ ] sw-007.png — Duplicate Cleaner
- [ ] sw-008.png — CamScanner Premium
- [ ] sw-009.png — Windows 7/8/10/11 Retail Key
- [ ] sw-010.png — AutoCAD with Activator & Serial Keys
- [ ] sw-011.png — AnyChat Live Chat Platform
- [ ] sw-012.png — 100+ Premium Android Apps Bundle

### Tutorials — 6
- [ ] tu-001.png — Visa Processing Course
- [ ] tu-002.png — Advance Logo Design in Adobe Illustrator
- [ ] tu-003.png — Advance Web Development with PHP & Laravel
- [ ] tu-004.png — Advance HTML & CSS by UYLab
- [ ] tu-005.png — Advance SEO Course by UY Lab
- [ ] tu-006.png — AI Image Generator Tutorial by UY Lab

### Digital Services — 6
- [ ] sv-001.png — Facebook BIN Number
- [ ] sv-002.png — Facebook Page Likes, Share & Comment Service
- [ ] sv-003.png — YouTube Services – Subscribers, Likes, Watch Time
- [ ] sv-004.png — Digital Marketing Monthly Package
- [ ] sv-005.png — Professional Web Design Services
- [ ] sv-006.png — Facebook Page Review

### eBooks & Entertainment — 10
- [ ] eb-001.png — 1400+ ChatGPT Prompts Library
- [ ] eb-002.png — Gora Theke Digital Marketing
- [ ] eb-003.png — Uddoktader Prothom Thikana eBook
- [ ] eb-004.png — 5K Bangla eBook Bundle Collection
- [ ] eb-005.png — Learn English Easily eBooks
- [ ] eb-006.png — Bangla Comics eBook Collection 85+
- [ ] eb-007.png — Bangla Islamic Books PDF Collection 1300+
- [ ] eb-008.png — 100+ Muhammed Zafar Iqbal Books PDF
- [ ] eb-009.png — 200+ Tin Goyenda Books PDF
- [ ] eb-010.png — 300+ Masud Rana eBooks PDF
