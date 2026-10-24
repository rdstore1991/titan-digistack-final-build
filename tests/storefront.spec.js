// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';
import url from 'url';

const indexUrl = url.pathToFileURL(path.resolve('index.html')).href;
const shopUrl = url.pathToFileURL(path.resolve('pages/shop.html')).href;
const cartUrl = url.pathToFileURL(path.resolve('pages/cart.html')).href;
const contactUrl = url.pathToFileURL(path.resolve('pages/contact.html')).href;
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

    // Toggle colorway menu
    const toggleBtn = page.locator('#colorwayToggle');
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();

    // Menu should be visible
    const menu = page.locator('#colorwayMenu');
    await expect(menu).toBeVisible();

    // Verify computed styles
    const menuZIndex = await menu.evaluate(el => window.getComputedStyle(el).zIndex);
    const headerZIndex = await page.locator('.site-header').evaluate(el => window.getComputedStyle(el).zIndex);
    const headerPosition = await page.locator('.site-header').evaluate(el => window.getComputedStyle(el).position);
    const switcherPosition = await page.locator('.colorway-switcher').evaluate(el => window.getComputedStyle(el).position);

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

  test('Product cards render official brand vector avatars with squircle styling and 3-tier fallbacks', async ({ page }) => {
    await page.goto(indexUrl);

    const avatars = page.locator('.product-card__avatar');
    await expect(avatars.first()).toBeVisible();
    
    // Check squircle dimensions (52x52)
    const box = await avatars.first().boundingBox();
    expect(box?.width).toBeCloseTo(52, 1);
    expect(box?.height).toBeCloseTo(52, 1);

    // Verify 3-tier icon engine produces Google favicons, SimpleIcons, or category SVGs (zero text initials)
    const cardAvatars = await page.locator('.product-card__avatar').all();
    expect(cardAvatars.length).toBeGreaterThan(0);

    for (const avatar of cardAvatars.slice(0, 10)) {
      const hasLogo = await avatar.locator('.product-brand-logo').count();
      const hasSvg = await avatar.locator('.category-fallback-svg, svg').count();
      expect(hasLogo > 0 || hasSvg > 0).toBeTruthy();
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

    // Verify trust pills
    await expect(page.locator('.trust-pill--bkash')).toHaveText('bKash');
    await expect(page.locator('.trust-pill--nagad')).toHaveText('Nagad');
    await expect(page.locator('.trust-pill--card')).toHaveText('Visa/MC');
    await expect(page.locator('.trust-pill--binance')).toHaveText('Binance Pay (USDT)');

    // Verify quick-preview modal is hidden by default and not leaking into page layout
    const modal = page.locator('#quickPreviewModal');
    await expect(modal).toBeHidden();
  });

  test('Cart-First checkout drawer and Payment Verification Modal operate dynamically', async ({ page }) => {
    await page.goto(indexUrl);

    // Mock clipboard writeText for cross-browser testing
    await page.evaluate(() => {
      if (!navigator.clipboard) {
        // @ts-ignore
        navigator.clipboard = {};
      }
      navigator.clipboard.writeText = async () => {};
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

});


