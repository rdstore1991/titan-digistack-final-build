// @ts-check
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import url from 'url';

/**
 * @typedef {Object} TitanWindowGlobals
 * @property {{ whatsappNumber?: string, whatsappDisplay?: string, supportEmail?: string, adminEmail?: string }} [STORE_CONFIG]
 * @property {{ supportEmail?: string, adminEmail?: string }} [PAYMENT_CONFIG]
 * @property {{ contactEmail?: string, supportEmail?: string, adminEmail?: string }} [TITAN_CONFIG]
 */

const indexUrl = url.pathToFileURL(path.resolve('index.html')).href;
const shopUrl = url.pathToFileURL(path.resolve('pages/shop.html')).href;
const cartUrl = url.pathToFileURL(path.resolve('pages/cart.html')).href;
const contactUrl = url.pathToFileURL(path.resolve('pages/contact.html')).href;
const aboutUrl = url.pathToFileURL(path.resolve('pages/about.html')).href;
const notFoundUrl = url.pathToFileURL(path.resolve('404.html')).href;

test.describe('Titan DigiStack E2E Test Suite', () => {

  test('Homepage loads with valid header, branding row, and zero console errors', async ({ page }) => {
    /** @type {string[]} */
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('ERR_FILE_NOT_FOUND') && !msg.text().includes('Failed to load resource') && !msg.text().includes('Not allowed to load local resource')) {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(indexUrl);

    // Expect page title
    await expect(page).toHaveTitle(/Titan DigiStack/);

    // Verify Header Layout & Branding Row
    const headerCard = page.locator('.site-header__card');
    await expect(headerCard).toBeVisible();

    const brandingRow = page.locator('.header-branding-row');
    await expect(brandingRow).toBeVisible();

    // Verify Left Logo Card (180px)
    const logoCard = page.locator('.header-left');
    await expect(logoCard).toBeVisible();
    const logoBox = await logoCard.boundingBox();
    expect(logoBox?.width).toBeCloseTo(180, 1);
    expect(logoBox?.height).toBeCloseTo(180, 1);

    // Verify Company Banner Frame
    const brandContainer = page.locator('.header-brand-container');
    await expect(brandContainer).toBeVisible();
    const banner = page.locator('.cyber-banner__content, .header-brand-img');
    await expect(banner).toBeVisible();

    // Check console errors
    expect(consoleErrors).toEqual([]);
  });

  test('Navigation anchors jump to existing sections correctly', async ({ page }) => {
    await page.goto(indexUrl);

    // Click EXPLORE
    const exploreLink = page.locator('.header-nav a[href="#catTabs"]');
    await expect(exploreLink).toBeVisible();
    await exploreLink.click();
    const catTabs = page.locator('#catTabs');
    await expect(catTabs).toBeVisible();

    // Click PRICING
    const pricingLink = page.locator('.header-nav a[href="#offerBanner"]');
    await expect(pricingLink).toBeVisible();
    await pricingLink.click();
    const offerBanner = page.locator('#offerBanner');
    await expect(offerBanner).toBeVisible();
  });

  test('Live search dropdown and card filtering works', async ({ page }) => {
    await page.goto(indexUrl);

    const searchInput = page.locator('#siteSearch');
    await searchInput.fill('Elementor');

    // Dropdown should be visible with options
    const dropdown = page.locator('#searchResults');
    await expect(dropdown).toBeVisible();
    const results = dropdown.locator('li[role="option"]');
    await expect(results.first()).toBeVisible();

    // Products in grid should be filtered
    const visibleCards = page.locator('.product-card:not(.is-hidden)');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Add to cart interaction updates badge and displays toast', async ({ page }) => {
    await page.goto(indexUrl);

    const cartBadge = page.locator('#cartCount');
    await expect(cartBadge).toHaveText('0');

    // Click Add button on hero card
    const addBtn = page.locator('.hero__showcase button[data-add-to-cart]').first();
    await addBtn.click();

    // Cart badge should increment
    await expect(cartBadge).toHaveText('1');

    // Cart toast notification should become visible
    const toast = page.locator('#cartToast');
    await expect(toast).toHaveClass(/is-visible/);
  });

  test('Subpages (Shop, Cart, Contact) render cleanly', async ({ page }) => {
    for (const subUrl of [shopUrl, cartUrl, contactUrl]) {
      await page.goto(subUrl);
      await expect(page.locator('.site-header__card')).toBeVisible();
      await expect(page.locator('.header-branding-row')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
    }
  });

  test('Colorway dropdown menu opens above adjacent page sections with elevated z-index', async ({ page }) => {
    await page.goto(indexUrl);

    // Toggle colorway menu via separated #toggleThemeBtn
    const toggleBtn = page.locator('#toggleThemeBtn');
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();

    // Menu should be visible
    const menu = page.locator('#colorwayMenu');
    await expect(menu).toBeVisible();

    // Verify computed styles
    const menuZIndex = await menu.evaluate(el => window.getComputedStyle(el).zIndex);
    const headerZIndex = await page.locator('.site-header').evaluate(el => window.getComputedStyle(el).zIndex);
    const headerPosition = await page.locator('.site-header').evaluate(el => window.getComputedStyle(el).position);
    const switcherPosition = await page.locator('.header-theme-control').evaluate(el => window.getComputedStyle(el).position);

    expect(Number(menuZIndex)).toBe(1000);
    expect(Number(headerZIndex)).toBe(100);
    expect(headerPosition).toBe('relative');
    expect(switcherPosition).toBe('relative');
  });

  test('Cloudflare 404 page renders with cyber aesthetic and recovery buttons', async ({ page }) => {
    await page.goto(notFoundUrl);
    await expect(page).toHaveTitle(/404/);
    await expect(page.locator('h1')).toContainText('SIGNAL LOST');
    const homeBtn = page.locator('a[href="index.html"]', { hasText: 'RETURN TO HOMEPAGE' });
    await expect(homeBtn).toBeVisible();
    const storeBtn = page.locator('a[href="pages/shop.html"]', { hasText: 'EXPLORE STORE' });
    await expect(storeBtn).toBeVisible();
  });

  test('Cart state persists across page reloads via localStorage', async ({ page }) => {
    await page.goto(indexUrl);

    // Initial cart badge is 0
    const cartBadge = page.locator('#cartCount');
    await expect(cartBadge).toHaveText('0');

    // Add item
    const addBtn = page.locator('.hero__showcase button[data-add-to-cart]').first();
    await addBtn.click();
    await expect(cartBadge).toHaveText('1');

    // Reload page
    await page.reload();
    await expect(page.locator('#cartCount')).toHaveText('1');
  });

  test('Mobile viewport (375px) renders thumb-zone bar and adapts branding', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(indexUrl);

    // Mobile bottom bar should be visible on 375px width
    const mobileBottomBar = page.locator('.mobile-bottom-bar');
    await expect(mobileBottomBar).toBeVisible();

    // Verify main header remains visible and compact
    const headerCard = page.locator('.site-header__card');
    await expect(headerCard).toBeVisible();
  });

  test('Product cards render full-width 16:9 local banner thumbnails and 68x68 card icons', async ({ page }) => {
    await page.goto(indexUrl);

    // Hero preview cards showcase 68x68 .card-icon local product thumbnails
    const heroIcons = page.locator('.hero-preview-card .card-icon');
    await expect(heroIcons).toHaveCount(2);
    const iconBox = await heroIcons.first().boundingBox();
    expect(iconBox?.width).toBeCloseTo(68, 1);
    expect(iconBox?.height).toBeCloseTo(68, 1);

    // Product grid cards render full-width 16:9 top banner photos without duplicating avatar
    const firstCardImage = page.locator('.product-card .card-image').first();
    await expect(firstCardImage).toBeVisible();
    const bannerBox = await firstCardImage.boundingBox();
    expect(bannerBox).not.toBeNull();
    if (bannerBox) {
      expect(bannerBox.width / bannerBox.height).toBeCloseTo(16 / 9, 1);
    }

    const bannerPhotos = page.locator('.product-card .card-image__photo');
    expect(await bannerPhotos.count()).toBeGreaterThan(20);
    for (let i = 0; i < 8; i++) {
      const img = bannerPhotos.nth(i);
      await expect(img).toBeVisible();
      const src = await img.getAttribute('src');
      expect(src).toMatch(/assets\/products\/.+\.(jpg|png|webp)/);
    }

    // Fallback .product-card__avatar stays hidden when banner photo loads
    await expect(page.locator('.product-card .product-card__avatar').first()).toBeHidden();
  });

  test('Static HTML pre-bakes starting BDT prices, Buy Now CTAs, OpenGraph tags, JSON-LD, strict hidden modals, and floating WhatsApp button', async ({ page }) => {
    for (const file of ['index.html', 'pages/shop.html']) {
      const rawHtml = fs.readFileSync(path.resolve(file), 'utf8');
      expect(rawHtml).not.toMatch(/Call for Price/i);
      expect(rawHtml).not.toMatch(/Get Price/i);
      expect(rawHtml).not.toContain('avatar-initials');
      expect((rawHtml.match(/<article class="product-card/g) || []).length).toBe(135);
      expect((rawHtml.match(/<div class="product-card__avatar"[^>]*><img src="[^"]*assets\/products\//g) || []).length).toBe(135);
      expect(rawHtml).toContain('class="product-price" data-price-bdt="350">৳350</span>');
      expect(rawHtml).toContain('class="product-price" data-price-bdt="999">৳999</span>');
      expect(rawHtml).toContain('class="product-price" data-price-bdt="180">৳180</span>');
      expect(rawHtml).toContain('class="product-price" data-price-bdt="450">৳450</span>');
      expect(rawHtml).toContain('class="product-price" data-price-bdt="499">৳499</span>');
      expect(rawHtml).toContain('class="product-price" data-price-bdt="199">৳199</span>');
      expect(rawHtml).toContain('class="product-price" data-price-bdt="399">৳399</span>');
      expect(rawHtml).toContain('class="product-price" data-price-bdt="160">৳160</span>');
      expect(rawHtml).toContain('class="product-price" data-price-bdt="320">৳320</span>');
      expect(rawHtml).toContain('class="product-price" data-price-bdt="299">৳299</span>');
      expect(rawHtml).toContain('Buy Now</button>');
      expect(rawHtml).toContain('property="og:image"');
      expect(rawHtml).toContain('application/ld+json');
    }

    for (const pageUrl of [indexUrl, shopUrl, contactUrl, cartUrl]) {
      await page.goto(pageUrl);

      // Unopened modals strictly enforce display:none, visibility:hidden, opacity:0, pointer-events:none
      for (const sel of ['#checkoutModal', '#quickPreviewModal']) {
        const loc = page.locator(sel);
        if (await loc.count()) {
          await expect(loc).toBeHidden();
          const styles = await loc.evaluate(el => {
            const cs = window.getComputedStyle(el);
            return { display: cs.display, visibility: cs.visibility, opacity: cs.opacity, pointerEvents: cs.pointerEvents };
          });
          expect(styles.display).toBe('none');
          expect(styles.visibility).toBe('hidden');
          expect(styles.opacity).toBe('0');
          expect(styles.pointerEvents).toBe('none');
        }
      }

      // Floating WhatsApp Live Support button (+1 672-895-2770) is visible in bottom-right
      const waFloat = page.locator('#whatsappLiveSupport');
      await expect(waFloat).toBeVisible();
      await expect(waFloat).toHaveAttribute('href', /wa\.me\/16728952770/);
      await expect(waFloat).toContainText('+1 672-895-2770');

      // OpenGraph meta tags exist
      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /assets\/og-banner\.jpg$/);
    }

    // Validate JSON-LD Product Schema on Homepage, Shop, and Contact
    for (const schemaUrl of [indexUrl, shopUrl, contactUrl]) {
      await page.goto(schemaUrl);
      const rawJsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
      expect(rawJsonLd).toBeTruthy();
      const parsed = JSON.parse(rawJsonLd || '{}');
      expect(parsed['@context']).toBe('https://schema.org');
      expect(Array.isArray(parsed['@graph'])).toBe(true);
    }
  });

  test('Interactive currency switcher converts prices accurately across BDT, INR, and USD', async ({ page }) => {
    await page.goto(indexUrl);

    // Initial price for ChatGPT Plus in BDT
    const chatGptPrice = page.locator('.product-card[data-id="ai-008"] .product-price');
    await expect(chatGptPrice).toHaveText('৳350');

    // Switch to INR
    const inrBtn = page.locator('button[data-currency="INR"]').first();
    await inrBtn.click();
    await expect(chatGptPrice).toHaveText('₹245'); // 350 * 0.70 = 245

    // Switch to USD
    const usdBtn = page.locator('button[data-currency="USD"]').first();
    await usdBtn.click();
    await expect(chatGptPrice).toHaveText('$2.91'); // (350 * 0.0083).toFixed(2) = 2.91

    // Switch back to BDT
    const bdtBtn = page.locator('button[data-currency="BDT"]').first();
    await bdtBtn.click();
    await expect(chatGptPrice).toHaveText('৳350');
  });

  test('Bento grid contains encrypted payment trust pills and quick-view modal remains hidden when closed', async ({ page }) => {
    await page.goto(indexUrl);

    // Verify encrypted payment trust pills
    await expect(page.locator('.trust-pill--bkash')).toHaveText('bKash');
    await expect(page.locator('.trust-pill--nagad')).toHaveText('Nagad');
    await expect(page.locator('.trust-pill--card')).toHaveText('Visa/MC');
    await expect(page.locator('.trust-pill--binance')).toHaveText('Binance Pay (USDT)');

    // Verify all 6 why__items contain dedicated trust pills
    const whyItems = page.locator('.why__item');
    await expect(whyItems).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      await expect(whyItems.nth(i).locator('.trust-pills')).toBeVisible();
      const count = await whyItems.nth(i).locator('.trust-pill').count();
      expect(count).toBeGreaterThanOrEqual(3);
    }

    // Verify quick-preview modal is hidden by default and not leaking into page layout
    const modal = page.locator('#quickPreviewModal');
    await expect(modal).toBeHidden();
  });

  test('Cart-First checkout drawer and Payment Verification Modal operate dynamically', async ({ page }) => {
    await page.goto(indexUrl);

    // Mock clipboard writeText for cross-browser testing
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: async () => { } },
        configurable: true,
      });
    });

    const cartDrawer = page.locator('#cartDrawer');
    const checkoutModal = page.locator('#checkoutModal');
    await expect(cartDrawer).toBeHidden();
    await expect(checkoutModal).toBeHidden();

    // Click Buy Now on ChatGPT Plus hero card
    const heroBuyBtn = page.locator('.hero__showcase button[data-add-to-cart][data-id="ai-008"]').first();
    await heroBuyBtn.click();

    // Cart Drawer should open first (Cart-First architecture)
    await expect(cartDrawer).toBeVisible();
    await expect(page.locator('#whatsappCheckoutBtn')).toBeVisible();
    await expect(page.locator('#openAdvancePayModalBtn')).toBeVisible();

    // Clicking 'Pay in Advance' closes cart drawer and opens checkout modal
    await page.locator('#openAdvancePayModalBtn').click();
    await expect(cartDrawer).toBeHidden();
    await expect(checkoutModal).toBeVisible();

    // Check populated fields
    await expect(page.locator('#checkoutProductName')).toHaveText(/ChatGPT Plus/);
    await expect(page.locator('#checkoutPayableAmount')).toHaveText('৳350');
    await expect(page.locator('#checkoutUsdtEquivalent')).toContainText('USDT');

    // Default tab is bKash
    await expect(page.locator('.payment-tab[data-method="bkash"]')).toHaveClass(/is-active/);
    await expect(page.locator('#paymentAccountLabel')).toHaveText('bKash Personal (Send Money)');
    await expect(page.locator('#cryptoWalletRow')).toBeHidden();

    // Switch to Nagad tab
    await page.locator('.payment-tab[data-method="nagad"]').click();
    await expect(page.locator('.payment-tab[data-method="nagad"]')).toHaveClass(/is-active/);
    await expect(page.locator('#paymentAccountLabel')).toHaveText('Nagad Personal (Send Money)');
    await expect(page.locator('#senderAccountLabel')).toHaveText('Sender Nagad Number *');
    await expect(page.locator('#trxIdLabel')).toHaveText('Nagad Transaction ID (TrxID) *');
    await expect(page.locator('#cryptoWalletRow')).toBeHidden();

    // Switch to Binance tab
    await page.locator('.payment-tab[data-method="binance"]').click();
    await expect(page.locator('.payment-tab[data-method="binance"]')).toHaveClass(/is-active/);
    await expect(page.locator('#paymentAccountLabel')).toHaveText(/Binance\s*Pay ID \(0% Fee\)/);
    await expect(page.locator('#cryptoWalletRow')).toBeVisible();
    await expect(page.locator('#senderAccountLabel')).toHaveText('Your Binance ID / Wallet *');
    await expect(page.locator('#trxIdLabel')).toHaveText('Binance Order ID / TxHash *');

    // Test Copy button
    const copyBtn = page.locator('#copyPaymentAccountBtn');
    await copyBtn.click();
    await expect(copyBtn).toContainText('Copied! ✓');

    // Fill TrxID verification form
    await page.locator('#customerEmail').fill('tester@example.com');
    await page.locator('#senderAccount').fill('01711223344');
    await page.locator('#transactionId').fill('BN89234KL1');

    // Intercept window.open so popup doesn't block test
    await page.evaluate(() => {
      window.open = () => null;
    });

    // Submit form
    await page.locator('#submitOrderBtn').click();

    // Modal should show success view with Order ID
    const successView = page.locator('.checkout-success-view');
    await expect(successView).toBeVisible();
    await expect(successView.locator('.checkout-order-chip')).toContainText('Order ID: #TDS-');

    // Click Done & Close
    await page.locator('#checkoutSuccessDoneBtn').click();
    await expect(checkoutModal).toBeHidden();
  });

  test('Official business emails (support@bdexchz.live & admin@bdexchz.live) are integrated across JS config, footers, checkout modal, and contact page', async ({ page }) => {
    for (const file of ['index.html', 'pages/shop.html', 'pages/contact.html', 'pages/cart.html', '404.html', 'js/main.js']) {
      const content = fs.readFileSync(path.resolve(file), 'utf8');
      expect(content).not.toMatch(/titandigistack\.com/i);
    }

    await page.goto(indexUrl);
    const configEmails = await page.evaluate(() => {
      const win = /** @type {Window & TitanWindowGlobals} */ (window);
      return {
        support: win.STORE_CONFIG?.supportEmail,
        admin: win.STORE_CONFIG?.adminEmail,
        paymentSupport: win.PAYMENT_CONFIG?.supportEmail,
        titanEmail: win.TITAN_CONFIG?.contactEmail,
      };
    });
    expect(configEmails).toEqual({
      support: 'support@bdexchz.live',
      admin: 'admin@bdexchz.live',
      paymentSupport: 'support@bdexchz.live',
      titanEmail: 'support@bdexchz.live',
    });

    for (const pageUrl of [indexUrl, shopUrl, contactUrl, cartUrl, notFoundUrl]) {
      await page.goto(pageUrl);
      const footerSupport = page.locator('.site-footer .footer-contact-emails a.footer-email-link[href="mailto:support@bdexchz.live"]');
      const footerAdmin = page.locator('.site-footer .footer-contact-emails a.footer-email-link[href="mailto:admin@bdexchz.live"]');
      await expect(footerSupport).toBeVisible();
      await expect(footerSupport).toContainText('24/7 Support:');
      await expect(footerAdmin).toBeVisible();
      await expect(footerAdmin).toContainText('Billing & Admin:');

      const trustMail = page.locator('#checkoutModal .checkout-trust-note a[href="mailto:support@bdexchz.live"]');
      await expect(trustMail).toHaveCount(1);
    }

    // Contact page inquiry cards & email dispatch fallback
    await page.goto(contactUrl);
    await expect(page.locator('aside.contact-info a[href="mailto:support@bdexchz.live?subject=Order%20Support%20-%20Titan%20DigiStack"]')).toBeVisible();
    await expect(page.locator('aside.contact-info a[href="mailto:admin@bdexchz.live?subject=Enterprise%20%26%20Admin%20Inquiry%20-%20Titan%20DigiStack"]')).toBeVisible();

    await page.locator('#cName').fill('Enterprise Tester');
    await page.locator('#cEmail').fill('buyer@company.com');
    await page.locator('#cTopic').selectOption('License Assistance');
    await page.locator('#cMsg').fill('Need activation assistance for order.');

    const emailBtn = page.locator('#contactEmailBtn');
    await expect(emailBtn).toBeVisible();

    const mailtoHref = await page.evaluate(() => {
      const win = /** @type {Window & TitanWindowGlobals} */ (window);
      const topicSelect = /** @type {HTMLSelectElement | null} */ (document.getElementById('cTopic'));
      const supportAddr = win.STORE_CONFIG?.supportEmail ?? '';
      const selectedTopic = topicSelect?.value ?? '';
      return `mailto:${supportAddr}?subject=${encodeURIComponent(`${selectedTopic} - Titan DigiStack`)}`;
    });
    expect(mailtoHref).toBe('mailto:support@bdexchz.live?subject=License%20Assistance%20-%20Titan%20DigiStack');
  });

  test('16. Luminous Slate Default Palette, Brightened Card Surfaces & Crystal Daylight Mode', async ({ page }) => {
    await page.goto(indexUrl);

    const defaultStyles = await page.evaluate(() => {
      const bodyStyle = getComputedStyle(document.body);
      const card = document.querySelector('.product-card[data-id="ai-008"]');
      const title = card?.querySelector('.card-title');
      const price = card?.querySelector('.product-price');
      const footer = document.querySelector('.site-footer');
      return {
        bodyBg: bodyStyle.backgroundColor,
        bodyColor: bodyStyle.color,
        cardRadius: card ? getComputedStyle(card).borderRadius : '',
        cardPadding: card ? getComputedStyle(card).paddingTop : '',
        titleColor: title ? getComputedStyle(title).color : '',
        priceColor: price ? getComputedStyle(price).color : '',
        footerBg: footer ? getComputedStyle(footer).backgroundColor : '',
      };
    });

    // Luminous Slate (#0f172a -> rgb(15, 23, 42)) & Crisp Off-White (#f8fafc -> rgb(248, 250, 252))
    expect(defaultStyles.bodyBg).toBe('rgb(15, 23, 42)');
    expect(defaultStyles.bodyColor).toBe('rgb(248, 250, 252)');
    expect(defaultStyles.cardRadius).toBe('16px');
    expect(defaultStyles.cardPadding).toBe('20px');
    expect(defaultStyles.titleColor).toBe('rgb(255, 255, 255)');
    expect(defaultStyles.priceColor).toBe('rgb(56, 189, 248)');
    expect(defaultStyles.footerBg).toBe('rgb(11, 19, 36)');

    // Verify clean SaaS filter pills exist with All active
    await expect(page.locator('.search-filters [data-filter-cat="all"]')).toHaveClass(/is-active/);
    await expect(page.locator('.search-filters [data-filter-cat]')).toHaveCount(6);

    // Switch to Crystal Daylight
    await page.locator('#toggleThemeBtn').click();
    await page.locator('[data-set-colorway="crystal"]').click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(241, 245, 249)');
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(15, 23, 42)');
    await expect(page.locator('.product-card[data-id="ai-008"] .card-title')).toHaveCSS('color', 'rgb(15, 23, 42)');

    // Switch back to Luminous Slate (aurora)
    await page.locator('#toggleThemeBtn').click();
    await page.locator('[data-set-colorway="aurora"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(15, 23, 42)');
  });

  test('17. Separated .toggle-theme-btn after .header-actions & Comprehensive About Us Portfolio page (pages/about.html)', async ({ page }) => {
    // 1. Verify DOM separation across all 6 HTML pages: .header-theme-control is placed AFTER .header-actions inside .header-right
    for (const targetUrl of [indexUrl, shopUrl, cartUrl, contactUrl, aboutUrl, notFoundUrl]) {
      await page.goto(targetUrl);

      const domCheck = await page.evaluate(() => {
        const headerRight = document.querySelector('.header-right');
        const headerActions = headerRight?.querySelector('.header-actions');
        const themeControl = headerRight?.querySelector('.header-theme-control');
        const toggleBtn = themeControl?.querySelector('button.toggle-theme-btn#toggleThemeBtn');
        const insideActions = headerActions?.querySelector('.toggle-theme-btn, #toggleThemeBtn, .colorway-switcher');
        return {
          hasHeaderRight: Boolean(headerRight),
          isDirectSiblingAfter: headerActions?.nextElementSibling === themeControl,
          hasToggleBtn: Boolean(toggleBtn),
          insideActionsCount: insideActions ? 1 : 0,
        };
      });

      expect(domCheck).toEqual({
        hasHeaderRight: true,
        isDirectSiblingAfter: true,
        hasToggleBtn: true,
        insideActionsCount: 0,
      });

      // Verify About & Portfolio navigation & footer links exist on every page
      await expect(page.locator('.header-nav a', { hasText: 'About & Portfolio' })).toBeVisible();
      await expect(page.locator('.site-footer a', { hasText: 'About Us & Portfolio' })).toBeVisible();
    }

    // 2. Navigate to pages/about.html with clean storage and audit zero console/asset errors + all 7 sections
    /** @type {string[]} */
    const consoleErrors = [];
    /** @type {string[]} */
    const failedLocalAssets = [];

    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('ERR_NAME_NOT_RESOLVED')) {
        consoleErrors.push(msg.text());
      }
    });
    page.on('requestfailed', req => {
      if (req.url().startsWith('file://')) {
        failedLocalAssets.push(req.url());
      }
    });

    await page.goto(aboutUrl);
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    expect(consoleErrors).toEqual([]);
    expect(failedLocalAssets).toEqual([]);

    // Defaults cleanly to Crystal Daylight design system on fresh load
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('.header-nav a.active', { hasText: 'About & Portfolio' })).toBeVisible();

    // Section 1: Corporate Identity & Mission Hero
    await expect(page.locator('.about-hero__badge')).toContainText('OFFICIAL CORPORATE PROFILE & PORTFOLIO');
    await expect(page.locator('#aboutHeroTitle')).toHaveText('Architecting Next-Gen Digital Infrastructure, AI Access & Enterprise Software Solutions');
    await expect(page.locator('.about-hero__actions a[href="shop.html"]')).toContainText('Explore Full Catalog');
    await expect(page.locator('.about-hero__actions a.btn-whatsapp-partner')).toHaveAttribute('href', /wa\.me\/16728952770/);

    // Section 2: 4 Live Impact Stat Cards
    await expect(page.locator('.about-metric-card')).toHaveCount(4);
    await expect(page.locator('.about-metrics-grid')).toContainText('10,000+');
    await expect(page.locator('.about-metrics-grid')).toContainText('129+');
    await expect(page.locator('.about-metrics-grid')).toContainText('99.9%');
    await expect(page.locator('.about-metrics-grid')).toContainText('< 5 Mins');

    // Section 3: 2-Column Who We Are & Technical DNA Bento
    await expect(page.locator('.about-bento-card')).toHaveCount(2);
    await expect(page.locator('.about-dna-item')).toHaveCount(4);

    // Section 4: 6-Card Filterable Company Portfolio & Service Divisions
    const divisionCards = page.locator('.portfolio-card');
    await expect(divisionCards).toHaveCount(6);
    await page.locator('[data-portfolio-filter="ai"]').click();
    await expect(page.locator('.portfolio-card:not(.is-filtered-out)')).toHaveCount(1);
    await expect(page.locator('.portfolio-card:not(.is-filtered-out)')).toContainText('Generative AI & LLM Infrastructure');
    await page.locator('[data-portfolio-filter="all"]').click();
    await expect(page.locator('.portfolio-card:not(.is-filtered-out)')).toHaveCount(6);

    // Section 5: 3 Featured Case Studies
    await expect(page.locator('.case-study-card')).toHaveCount(3);
    await expect(page.locator('#caseStudies')).toContainText('62%');
    await expect(page.locator('#caseStudies')).toContainText('30+');
    await expect(page.locator('#caseStudies')).toContainText('2,500+');

    // Section 6: 4-Step Verification & Fulfillment Pipeline
    await expect(page.locator('.pipeline-step')).toHaveCount(4);

    // Section 7: Corporate Contact & Verification Banner
    await expect(page.locator('.corporate-channel-card')).toHaveCount(3);
    await expect(page.locator('.corporate-contact-banner')).toContainText('+1 (672) 895-2770');
    await expect(page.locator('.corporate-contact-banner')).toContainText('support@bdexchz.live');
    await expect(page.locator('.corporate-contact-banner')).toContainText('admin@bdexchz.live');

    // Unopened modals remain strictly hidden
    await expect(page.locator('#cartDrawer')).toBeHidden();
    await expect(page.locator('#checkoutModal')).toBeHidden();
    await expect(page.locator('#quickPreviewModal')).toBeHidden();
  });

});


