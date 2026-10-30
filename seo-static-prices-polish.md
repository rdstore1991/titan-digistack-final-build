# Bake Static Prices, Modal Hiding, Banner Thumbnails, WhatsApp Support & SEO Schema

## Goal
Ship production SEO static pricing, strict hidden-modal enforcement, full-width 16:9 product banner thumbnails (with 68px fallback avatars), a floating WhatsApp Live Support FAB (+1 672-895-2770), and rich OpenGraph + JSON-LD Product Schema across the storefront, then push to `main`.

## Tasks
- [x] Task 1: Update `js/main.js` catalog (`PRODUCTS`) to replace flagship `price: null` items with starting BDT prices & cycles, and update `renderCard()` for full-width 16:9 banner thumbnails + fallback 68px `.product-card__avatar` → Verify: zero `Call for Price` items remain in rendered catalog.
- [x] Task 2: Update `css/style.css` and `css/components.css` with strict `[hidden]` modal rules, 16:9 `.card-image` top banner presentation, 68px `.product-card__avatar` / `.card-icon` styling, and `.whatsapp-float` live support FAB → Verify: unopened modals have `display: none`, `visibility: hidden`, `opacity: 0`, `pointer-events: none`.
- [x] Task 3: Bake static HTML flagship product cards (`<span class="product-price" data-price-bdt="...">৳...</span>` + `Buy Now`), OpenGraph/Twitter meta tags, JSON-LD `Product` / `Organization` schema, and floating WhatsApp button into `index.html`, `pages/shop.html`, `pages/contact.html`, and `pages/cart.html` → Verify: raw HTML contains indexable BDT prices, valid JSON-LD, OG tags, and WhatsApp FAB.
- [x] Task 4: Update `tests/storefront.spec.js` and run full Playwright E2E suite → Verify: `npx playwright test --project=chromium` passes 100%.
- [x] Task 5: Stage, commit, and push all changes to `origin/main` → Verify: `git status` clean and `git push origin main` succeeds.

## Done When
- [x] Static HTML in `index.html` & `pages/shop.html` exposes real BDT prices & `Buy Now` CTAs to crawlers without `"Call for Price"`.
- [x] Unopened modals are strictly hidden across all pages.
- [x] Product cards render full-width 16:9 top banner local thumbnails cleanly and 68px `.card-icon` / `.product-card__avatar` rules are active.
- [x] Floating WhatsApp Live Support (`+1 672-895-2770`) + JSON-LD Product Schema + OpenGraph (`1200x630` `assets/og-banner.jpg`) are live and verified via Playwright, committed, and pushed to `main`.
