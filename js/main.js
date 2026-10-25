/* ============================================================
   Titan DigiStack — main.js
   - Product catalog (single source of truth)
   - 3D Tilt & Specular Glare Gesture Engine
   - Floating Capsule Sliding Indicator Physics
   - Dynamic Colorway Switcher & Ambient Aura
   - Quick-Preview Drawer & Modal
   - Grid rendering per category, tabs, sticky header, shop filters
   ============================================================ */

/* -----------------------------
   Configurable contact endpoints
   Update these for "Call for Price" CTAs.
   ----------------------------- */
/* -----------------------------
   Global Store & Payment Configuration
   Official WhatsApp: +1 (672) 895-2770 (16728952770)
   ----------------------------- */
const STORE_CONFIG = {
  whatsappNumber: "16728952770", // +1 (672) 895-2770
  whatsappDisplay: "+1 (672) 895-2770",
  bkash: {
    name: "bKash",
    type: "Personal (Send Money)",
    number: "01711280684",
    color: "#e2136e"
  },
  nagad: {
    name: "Nagad",
    type: "Personal (Send Money)",
    number: "01711280684",
    color: "#f7941d"
  },
  binance: {
    name: "BinancePay ID (0% Fee)",
    payId: "570493144",
    walletAddress: "0xB0cEEbb2C11288fE37148ceCfFcc8A215A9cef15",
    network: "BNB Smart Chain",
    usdtRate: 0.0083,
    color: "#f3ba2f"
  }
};
window.STORE_CONFIG = STORE_CONFIG;

window.TITAN_CONFIG = {
  whatsappNumber: STORE_CONFIG.whatsappNumber,
  whatsappDisplay: STORE_CONFIG.whatsappDisplay,
  contactEmail:   'hello@titandigistack.com',
};

/* -----------------------------
   Central Payment & Gateway Configuration
   bKash, Nagad, Binance Pay & WhatsApp Verification Routing
   ----------------------------- */
const PAYMENT_CONFIG = {
  whatsappAdmin: STORE_CONFIG.whatsappDisplay,
  whatsappNumber: STORE_CONFIG.whatsappNumber,
  bkash: {
    ...STORE_CONFIG.bkash,
    instructions: "Open your bKash App → Select 'Send Money' → Enter the number below and exact BDT amount → Copy the Transaction ID (TrxID)."
  },
  nagad: {
    ...STORE_CONFIG.nagad,
    instructions: "Open your Nagad App → Select 'Send Money' → Enter the number below and exact BDT amount → Copy the Transaction ID (TrxID)."
  },
  binance: {
    ...STORE_CONFIG.binance,
    instructions: "Open Binance App → Go to Binance Pay → Send the exact USDT amount to the Pay ID below (0% Fee) → Enter the Binance Order ID / TxID."
  }
};
window.PAYMENT_CONFIG = PAYMENT_CONFIG;

/* -----------------------------
   Catalog (129 verified products)
   ----------------------------- */
const PRODUCTS = [
  /* ----- WordPress Themes ----- */
  { id: 'th-001', title: 'Digital Product Selling Website Template', price: 0,    cycle: 'Lifetime', badge: 'free', category: 'themes' },
  { id: 'th-002', title: 'KitNinja – Ultimate Ecommerce Template',   price: null, badge: 'call', category: 'themes' },
  { id: 'th-003', title: '100+ Bangla Landing Page Templates',       price: 100,  cycle: 'Lifetime', badge: 'new',  category: 'themes' },
  { id: 'th-004', title: '1000+ Elementor Landing Page Templates',   price: 150,  cycle: 'Lifetime', category: 'themes' },
  { id: 'th-005', title: 'Astra Pro / GeneratePress',                price: 599,  cycle: 'Lifetime', badge: 'sale', category: 'themes' },
  { id: 'th-006', title: 'GeneratePress Premium',                    price: 599,  cycle: 'Lifetime', category: 'themes' },
  { id: 'th-007', title: 'Rishi Theme Agency Pack Lifetime',         price: 600,  cycle: 'Lifetime', category: 'themes' },
  { id: 'th-008', title: 'OceanWP Theme Premium',                    price: 600,  cycle: 'Lifetime', category: 'themes' },
  { id: 'th-009', title: 'Divi WordPress Theme',                     price: 650,  cycle: '/ yr', category: 'themes' },
  { id: 'th-010', title: 'Zakra Theme Lifetime',                     price: 660,  cycle: 'Lifetime', category: 'themes' },
  { id: 'th-011', title: 'Kadence Theme',                            price: 720,  cycle: '/ yr', category: 'themes' },
  { id: 'th-012', title: 'XStore WordPress Theme',                   price: 780,  cycle: 'Lifetime', category: 'themes' },
  { id: 'th-013', title: 'Woodmart WordPress Theme',                 price: 960,  cycle: 'Lifetime', category: 'themes' },
  { id: 'th-014', title: 'GPL WordPress Theme & Plugin Membership',  price: 1050, cycle: '/ yr', badge: 'sale', category: 'themes' },
  { id: 'th-015', title: 'Woostify Theme Lifetime',                  price: 1250, cycle: 'Lifetime', category: 'themes' },

  /* ----- WordPress Plugins ----- */
  { id: 'pl-001', title: 'ACF Pro',                                    price: 450,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-002', title: 'All-in-One WP Migration Unlimited',          price: 120,  cycle: 'Lifetime', category: 'plugins' },
  { id: 'pl-003', title: 'bKash Sandbox API Test Plugin',              price: 0,    cycle: 'Lifetime', badge: 'free', category: 'plugins' },
  { id: 'pl-004', title: 'Cartflows Pro License',                      price: 750,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-005', title: 'Elementor Agency One Plan',                  price: 450,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-006', title: 'Elementor Pro',                              price: 499,  cycle: '/ yr', badge: 'sale', category: 'plugins' },
  { id: 'pl-007', title: 'ElementsKit Premium',                        price: 720,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-008', title: 'EWWW Image Optimizer',                       price: 950,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-009', title: 'Happy Addons for Elementor',                 price: 750,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-010', title: 'Hide My WP Ghost',                           price: 1600, cycle: 'Lifetime', category: 'plugins' },
  { id: 'pl-011', title: 'Imagify API Image Optimization',             price: 660,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-012', title: 'JetFormBuilder PRO',                         price: 600,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-013', title: 'JetPlugins by Crocoblock',                   price: 700,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-014', title: 'Ninja Tables',                               price: null, badge: 'call', category: 'plugins' },
  { id: 'pl-015', title: 'Perfmatters Plugin',                         price: 480,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-016', title: 'Piotnet Addons For Elementor',               price: 400,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-017', title: 'PixelYourSite Pro',                          price: 1750, cycle: '/ yr', category: 'plugins' },
  { id: 'pl-018', title: 'PowerPack Addons for Elementor',             price: 360,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-019', title: 'Premium Addons Pro for Elementor',           price: 360,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-020', title: 'WP Rocket / RankMath Pro',                   price: 399,  cycle: '/ yr', badge: 'new', category: 'plugins' },
  { id: 'pl-021', title: 'Royal Elementor Addons',                     price: 3600, cycle: 'Lifetime', category: 'plugins' },
  { id: 'pl-022', title: 'ShopEngine – WooCommerce Builder',           price: 480,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-023', title: 'The Plus Addons For Elementor',              price: 420,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-024', title: 'Tutor LMS',                                  price: 550,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-025', title: 'Unlimited Addons for Elementor',             price: 600,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-026', title: 'WCFM Marketplace',                           price: 840,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-027', title: 'WooLentor Elementor Addon',                  price: 720,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-028', title: 'WP All Import and Export Plugin',            price: 1650, cycle: 'Lifetime', category: 'plugins' },
  { id: 'pl-029', title: 'WP Encryption SSL Solution',                 price: 720,  cycle: '/ yr', category: 'plugins' },
  { id: 'pl-030', title: 'WP Funnels Pro',                             price: 600,  cycle: '/ yr', category: 'plugins' },

  /* ----- Graphic Tools ----- */
  { id: 'gr-001', title: '20,000+ PSD & CDR Flyer Templates',          price: 50,   cycle: 'Lifetime', badge: 'sale', category: 'graphic' },
  { id: 'gr-002', title: 'Freepik Premium',                            price: 280,  cycle: '/ mo', badge: 'sale', category: 'graphic' },
  { id: 'gr-003', title: 'Runway ML Subscription',                     price: null, badge: 'call', category: 'graphic' },
  { id: 'gr-004', title: 'Midjourney Pro',                             price: 550,  cycle: '/ mo', badge: 'sale', category: 'graphic' },
  { id: 'gr-005', title: 'Recraft AI Subscription & Credits',          price: null, badge: 'call', category: 'graphic' },
  { id: 'gr-006', title: 'Ideogram AI',                                price: null, badge: 'call', category: 'graphic' },
  { id: 'gr-007', title: 'ElevenLabs Creator Plan',                    price: null, badge: 'call', category: 'graphic' },
  { id: 'gr-008', title: 'Taja AI – Video Content Automation',         price: null, badge: 'call', category: 'graphic' },
  { id: 'gr-009', title: 'HeyGen Official Subscription',               price: null, badge: 'call', category: 'graphic' },
  { id: 'gr-010', title: 'InVideo Official Subscription',              price: null, badge: 'call', category: 'graphic' },
  { id: 'gr-011', title: 'JoggAI – AI Video Generator',                price: null, badge: 'call', category: 'graphic' },
  { id: 'gr-012', title: 'Envato Elements',                            price: 299,  cycle: '/ mo', category: 'graphic' },
  { id: 'gr-013', title: 'Filmora 14 Lifetime',                        price: 350,  cycle: 'Lifetime', category: 'graphic' },
  { id: 'gr-014', title: 'Adobe Creative Cloud Official',              price: null, badge: 'call', category: 'graphic' },
  { id: 'gr-015', title: 'CapCut Pro',                                 price: 250,  cycle: '/ mo', category: 'graphic' },
  { id: 'gr-016', title: 'Google One / Gemini Advanced',               price: 350,  cycle: '/ mo', badge: 'new',  category: 'graphic' },
  { id: 'gr-017', title: 'Canva Premium',                              price: 500,  cycle: '/ yr', category: 'graphic' },
  { id: 'gr-018', title: 'Canva Pro',                                  price: 199,  cycle: '/ yr', badge: 'sale', category: 'graphic' },
  { id: 'gr-019', title: 'Adobe Master Collection 2025',               price: 99,   cycle: 'Lifetime', badge: 'new',  category: 'graphic' },
  { id: 'gr-020', title: 'Adobe Master Collection 2024',               price: 99,   cycle: 'Lifetime', category: 'graphic' },

  /* ----- AI Tools & Subscriptions ----- */
  { id: 'ai-001', title: 'Higgsfield AI – Video & Image Generator',    price: null, badge: 'call', category: 'ai' },
  { id: 'ai-002', title: 'Beautiful AI',                               price: null, badge: 'call', category: 'ai' },
  { id: 'ai-003', title: 'Bolt AI Builder',                            price: null, badge: 'call', category: 'ai' },
  { id: 'ai-004', title: 'Branalyzer AI – Brand Analysis',             price: null, badge: 'call', category: 'ai' },
  { id: 'ai-005', title: 'LinkedIn Premium',                           price: 999,  cycle: '/ mo', badge: 'sale', category: 'ai' },
  { id: 'ai-006', title: 'Spotify Premium',                            price: 180,  cycle: '/ mo', category: 'ai' },
  { id: 'ai-007', title: 'ChatGPT Go',                                 price: null, badge: 'call', category: 'ai' },
  { id: 'ai-008', title: 'ChatGPT Plus',                               price: 350,  cycle: '/ mo', badge: 'sale', category: 'ai' },
  { id: 'ai-009', title: 'ChatPRD AI',                                 price: null, badge: 'call', category: 'ai' },
  { id: 'ai-010', title: 'Claude Pro',                                 price: 450,  cycle: '/ mo', badge: 'sale', category: 'ai' },
  { id: 'ai-011', title: 'ClickUp AI',                                 price: null, badge: 'call', category: 'ai' },
  { id: 'ai-012', title: 'Perplexity Pro',                             price: 299,  cycle: '/ mo', badge: 'new', category: 'ai' },
  { id: 'ai-013', title: 'CorelDRAW Subscription',                     price: null, badge: 'call', category: 'ai' },
  { id: 'ai-014', title: 'Coursera Plus',                              price: null, badge: 'call', category: 'ai' },
  { id: 'ai-015', title: 'DataCamp Subscription',                      price: null, badge: 'call', category: 'ai' },
  { id: 'ai-016', title: 'Descript – AI Video Editing',                price: null, badge: 'call', category: 'ai' },
  { id: 'ai-017', title: 'Cursor Pro',                                 price: 650,  cycle: '/ mo', badge: 'new', category: 'ai' },
  { id: 'ai-018', title: 'Duolingo Subscription',                      price: null, badge: 'call', category: 'ai' },
  { id: 'ai-019', title: 'Figma Professional',                         price: 499,  cycle: '/ yr', badge: 'sale', category: 'ai' },
  { id: 'ai-020', title: 'Fireflies AI',                               price: null, badge: 'call', category: 'ai' },
  { id: 'ai-021', title: 'FlexClip AI',                                price: null, badge: 'call', category: 'ai' },
  { id: 'ai-022', title: 'Flutterflow Subscription',                   price: null, badge: 'call', category: 'ai' },
  { id: 'ai-023', title: 'Foxly URL Shortener',                        price: null, badge: 'call', category: 'ai' },
  { id: 'ai-024', title: 'Gamma AI – Presentation Builder',            price: null, badge: 'call', category: 'ai' },
  { id: 'ai-025', title: 'GitHub Copilot',                             price: 399,  cycle: '/ mo', badge: 'sale', category: 'ai' },
  { id: 'ai-026', title: 'Grammarly Premium',                          price: 199,  cycle: '/ mo', badge: 'sale', category: 'ai' },
  { id: 'ai-027', title: 'Gravitec Push Notifications',                price: null, badge: 'call', category: 'ai' },
  { id: 'ai-028', title: 'Grok AI SuperGrok',                          price: null, badge: 'call', category: 'ai' },
  { id: 'ai-029', title: 'Semrush Pro',                                price: 399,  cycle: '/ mo', badge: 'sale', category: 'ai' },
  { id: 'ai-030', title: 'Gumloop AI Automation',                      price: null, badge: 'call', category: 'ai' },
  { id: 'ai-031', title: 'QuillBot Premium',                           price: 180,  cycle: '/ mo', badge: 'new',  category: 'ai' },
  { id: 'ai-032', title: 'Turnitin Student',                           price: 350,  cycle: '/ 6 mo', badge: 'new', category: 'ai' },

  /* ----- Software & Apps ----- */
  { id: 'sw-001', title: 'Truecaller Premium (Android & iOS)',         price: 250,   cycle: '/ yr', category: 'software' },
  { id: 'sw-002', title: 'Microsoft Office Professional 2019/2021/2024', price: null, badge: 'call', category: 'software' },
  { id: 'sw-003', title: 'Microsoft Office Professional 2010/2013/2016', price: null, badge: 'call', category: 'software' },
  { id: 'sw-004', title: 'Microsoft 365',                              price: 399,   cycle: '/ yr', badge: 'sale', category: 'software' },
  { id: 'sw-005', title: 'FastStone Capture – Official License',       price: 10,    cycle: 'Lifetime', category: 'software' },
  { id: 'sw-006', title: 'Fast Screen Recorder – Lifetime',            price: 10,    cycle: 'Lifetime', category: 'software' },
  { id: 'sw-007', title: 'Duplicate Cleaner',                          price: 0,     cycle: 'Lifetime', badge: 'free', category: 'software' },
  { id: 'sw-008', title: 'CamScanner Premium',                         price: 350,   cycle: '/ yr', category: 'software' },
  { id: 'sw-009', title: 'Windows 11 Pro Key',                         price: 450,   cycle: 'Lifetime', badge: 'sale', category: 'software' },
  { id: 'sw-010', title: 'AutoCAD with Activator & Serial Keys',       price: null,  badge: 'call', category: 'software' },
  { id: 'sw-011', title: 'AnyChat Live Chat Platform',                 price: 850,   cycle: 'Lifetime', category: 'software' },
  { id: 'sw-012', title: '100+ Premium Android Apps Bundle',           price: 0,     cycle: 'Lifetime', badge: 'free', category: 'software' },
  { id: 'sw-013', title: 'NordVPN / ExpressVPN',                       price: 199,   cycle: '/ mo', badge: 'sale', category: 'software' },

  /* ----- Tutorials ----- */
  { id: 'tu-001', title: 'Visa Processing Course',                     price: 0, badge: 'free', category: 'tutorials' },
  { id: 'tu-002', title: 'Advance Logo Design in Adobe Illustrator',   price: 0, badge: 'free', category: 'tutorials' },
  { id: 'tu-003', title: 'Advance Web Development with PHP & Laravel', price: 0, badge: 'free', category: 'tutorials' },
  { id: 'tu-004', title: 'Advance HTML & CSS by UYLab',                price: 0, badge: 'free', category: 'tutorials' },
  { id: 'tu-005', title: 'Advance SEO Course by UY Lab',               price: 0, badge: 'free', category: 'tutorials' },
  { id: 'tu-006', title: 'AI Image Generator Tutorial by UY Lab',      price: 0, badge: 'free', category: 'tutorials' },

  /* ----- Digital Services ----- */
  { id: 'sv-001', title: 'Facebook BIN Number',                        price: 150,    category: 'services' },
  { id: 'sv-002', title: 'Facebook Page Likes, Share & Comment Service', price: null, badge: 'call', category: 'services' },
  { id: 'sv-003', title: 'YouTube Services – Subscribers, Likes, Watch Time', price: 550, category: 'services' },
  { id: 'sv-004', title: 'Digital Marketing Monthly Package',          price: 50000,  category: 'services' },
  { id: 'sv-005', title: 'Professional Web Design Services',           price: 15000,  category: 'services' },
  { id: 'sv-006', title: 'Facebook Page Review',                       price: null,   badge: 'call', category: 'services' },

  /* ----- eBooks & Entertainment ----- */
  { id: 'eb-001', title: '1400+ ChatGPT Prompts Library',                                  price: 0,   badge: 'free', category: 'ebooks' },
  { id: 'eb-002', title: 'গোড়া থেকে ডিজিটাল মার্কেটিং (Gora Theke Digital Marketing)', price: 10,  category: 'ebooks' },
  { id: 'eb-003', title: 'Uddoktader Prothom Thikana eBook',                               price: 10,  category: 'ebooks' },
  { id: 'eb-004', title: '5K Bangla eBook Bundle Collection',                              price: 99,  badge: 'sale', category: 'ebooks' },
  { id: 'eb-005', title: 'Learn English Easily eBooks',                                    price: 0,   badge: 'free', category: 'ebooks' },
  { id: 'eb-006', title: 'Bangla Comics eBook Collection 85+',                             price: 0,   badge: 'free', category: 'ebooks' },
  { id: 'eb-007', title: 'Bangla Islamic Books PDF Collection 1300+',                      price: 0,   badge: 'free', category: 'ebooks' },
  { id: 'eb-008', title: '100+ Muhammed Zafar Iqbal Books PDF',                            price: 25,  category: 'ebooks' },
  { id: 'eb-009', title: '200+ Tin Goyenda Books PDF',                                     price: 25,  category: 'ebooks' },
  { id: 'eb-010', title: '300+ Masud Rana eBooks PDF',                                     price: 25,  category: 'ebooks' },
  { id: 'eb-011', title: 'YouTube Premium',                                                price: 160, cycle: '/ mo', badge: 'sale', category: 'ebooks' },
  { id: 'eb-012', title: 'Netflix UHD 4K',                                                 price: 320, cycle: '/ mo', badge: 'sale', category: 'ebooks' },
  { id: 'eb-013', title: 'Prime Video',                                                    price: 150, cycle: '/ mo', category: 'ebooks' },
];

window.PRODUCTS = PRODUCTS;

const CATEGORY_LABELS = {
  themes: 'WordPress Themes',
  plugins: 'WordPress Plugins',
  graphic: 'Graphic Tools',
  ai: 'AI Tools & Subscriptions',
  software: 'Software & Apps',
  tutorials: 'Tutorials',
  services: 'Digital Services',
  ebooks: 'eBooks & Entertainment',
};
window.CATEGORY_LABELS = CATEGORY_LABELS;

/* -----------------------------
   Helpers
   ----------------------------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function assetBase() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}
window.assetBase = assetBase;

window.IMAGE_EXTS = ['jpg', 'png', 'webp'];

window.tryNextImageExt = function (img) {
  const base = img.dataset.imgBase;
  if (!base) { img.style.display = 'none'; return; }
  const idx = (parseInt(img.dataset.extIdx || '0', 10)) + 1;
  if (idx >= window.IMAGE_EXTS.length) { img.style.display = 'none'; return; }
  img.dataset.extIdx = idx;
  img.src = `${base}.${window.IMAGE_EXTS[idx]}`;
};

function imageConfigFor(product) {
  if (!product || product.image === false) return null;

  if (typeof product.image === 'string') {
    const src = (product.image.startsWith('http') || product.image.startsWith('/'))
      ? product.image
      : assetBase() + product.image;
    const base = src.replace(/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i, '');
    return { base, src, chain: false };
  }

  const base = `${assetBase()}assets/products/${product.id}`;
  return { base, src: `${base}.jpg`, chain: true };
}
window.imageConfigFor = imageConfigFor;
window.defaultImageFor = (p) => { const c = imageConfigFor(p); return c ? c.src : null; };

const CURRENCY_RATES = {
  BDT: { symbol: '৳', rate: 1, format: (bdt) => (bdt === 0 ? 'Free' : `৳${Math.round(bdt).toLocaleString('en-BD')}`) },
  INR: { symbol: '₹', rate: 0.70, format: (bdt) => (bdt === 0 ? 'Free' : `₹${Math.round(bdt * 0.70).toLocaleString('en-IN')}`) },
  USD: { symbol: '$', rate: 0.0083, format: (bdt) => (bdt === 0 ? 'Free' : `$${(bdt * 0.0083).toFixed(2)}`) },
};

function getActiveCurrency() {
  try {
    return localStorage.getItem('titan_currency') || 'BDT';
  } catch {
    return 'BDT';
  }
}
window.getActiveCurrency = getActiveCurrency;

function convertPrice(bdt, currency = getActiveCurrency()) {
  if (bdt === null || bdt === undefined || bdt === 'call') return null;
  if (bdt === 0) return 'Free';
  const num = Number(bdt);
  if (isNaN(num)) return bdt;
  const cfg = CURRENCY_RATES[currency] || CURRENCY_RATES.BDT;
  return cfg.format(num);
}
window.convertPrice = convertPrice;

function formatPrice(p) {
  return convertPrice(p);
}

function priceLabel(product, currency = getActiveCurrency()) {
  if (product.price === null || product.price === undefined) return '📞 Call for Price';
  const lo = convertPrice(product.price, currency);
  if (product.priceMax) {
    const hi = convertPrice(product.priceMax, currency);
    return `${lo}–${hi}`;
  }
  return lo;
}

function placeholderColors(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const hue1 = h % 360;
  const hue2 = (hue1 + 45) % 360;
  return [`hsl(${hue1} 75% 24%)`, `hsl(${hue2} 80% 12%)`];
}

function placeholderInitials(title) {
  const words = title.replace(/[^a-z0-9 ]/gi, ' ').trim().split(/\s+/);
  return words.slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'TD';
}

function callForPriceHref(product, curr = getActiveCurrency()) {
  const num = (window.STORE_CONFIG && window.STORE_CONFIG.whatsappNumber) || (window.TITAN_CONFIG && window.TITAN_CONFIG.whatsappNumber) || '16728952770';
  const title = typeof product === 'string' ? product : product.title;
  const text = `Hi Titan DigiStack! I want an instant quote / inquiry for ${title} in ${curr}.`;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}
window.callForPriceHref = callForPriceHref;

function getWhatsAppQuoteUrl(title, curr = getActiveCurrency()) {
  return callForPriceHref({ title }, curr);
}
window.getWhatsAppQuoteUrl = getWhatsAppQuoteUrl;

/* ------------------------------------------------------------
   Product Card Avatar & Local Asset Routing
   Loads images directly from local assets directory
   ------------------------------------------------------------ */
function getBrandAvatar(title, category = 'ai') {
  return '';
}
window.getBrandAvatar = getBrandAvatar;

function getCategoryFallbackSVG(category = '') {
  return '';
}
window.getCategoryFallbackSVG = getCategoryFallbackSVG;
window.getCategoryFallbackSvg = getCategoryFallbackSVG;

function handleBrandLogoError(img) {
  if (img) img.style.display = 'none';
}
window.handleBrandLogoError = handleBrandLogoError;

/* -----------------------------
   Currency Switcher State & Engine
   ----------------------------- */
function setCurrency(curr) {
  const allowed = ['BDT', 'INR', 'USD'];
  const currency = allowed.includes(curr) ? curr : 'BDT';
  try {
    localStorage.setItem('titan_currency', currency);
  } catch {}

  // Update switcher button active state
  $$('.currency-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.getAttribute('data-currency') === currency);
  });

  // Convert all [data-price-bdt] elements
  $$('[data-price-bdt]').forEach(el => {
    const bdt = parseFloat(el.getAttribute('data-price-bdt'));
    if (!isNaN(bdt)) {
      el.textContent = convertPrice(bdt, currency);
    }
  });

  // Update quote buttons href with current currency
  $$('[data-quote-btn]').forEach(btn => {
    const title = btn.getAttribute('data-quote-title') || 'Product';
    btn.href = getWhatsAppQuoteUrl(title, currency);
  });

  document.dispatchEvent(new CustomEvent('titan:currency-changed', { detail: { currency } }));
}
window.setCurrency = setCurrency;

function initCurrencySwitcher() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-currency]');
    if (!btn) return;
    e.preventDefault();
    const curr = btn.getAttribute('data-currency');
    if (curr) setCurrency(curr);
  });

  // Initialize with persisted currency
  setCurrency(getActiveCurrency());
}

/* -----------------------------
   Product card render with 3D Tilt & Quick-View
   ----------------------------- */
function renderCard(product) {
  const isCall = product.price === null || product.price === undefined;
  const isFree = product.price === 0;
  const [c1, c2] = placeholderColors(product.id);

  const badgeHtml = (() => {
    if (product.badge === 'free' || isFree) return `<span class="badge badge--free">Free</span>`;
    if (product.badge === 'call' || isCall) return `<span class="badge badge--call">Quote</span>`;
    if (product.badge === 'sale') return `<span class="badge badge--sale">Sale</span>`;
    if (product.badge === 'new')  return `<span class="badge">New</span>`;
    return '';
  })();

  const imgCfg = imageConfigFor(product);
  const avatarMarkup = imgCfg
    ? `<div class="product-card__avatar" aria-hidden="true"><img src="${imgCfg.src}" alt="${product.title.replace(/"/g, '&quot;')}" loading="lazy" onerror="this.style.display='none'"></div>`
    : '';

  let priceHtml;
  let ctaHtml;

  if (isCall) {
    priceHtml = `
      <span class="price-badge price-badge--quote">
        <span class="pulse-dot"></span> Instant Quote
      </span>
    `;
    ctaHtml = `
      <a class="btn-cart call" data-quote-btn data-quote-title="${product.title.replace(/"/g, '&quot;')}" href="${callForPriceHref(product)}" target="_blank" rel="noopener" aria-label="Instant quote on WhatsApp for ${product.title.replace(/"/g, '&quot;')}">Get Quote</a>
    `;
  } else if (isFree) {
    priceHtml = `
      <div class="product-card__price-wrap">
        <span class="product-price" data-price-bdt="0">Free</span>
      </div>
    `;
    ctaHtml = `
      <button class="btn-cart" type="button" data-add-to-cart data-id="${product.id}" aria-label="Get ${product.title.replace(/"/g, '&quot;')}">Buy Now</button>
    `;
  } else {
    const cycle = product.cycle ? ` <span class="price-cycle">${product.cycle}</span>` : ' <span class="price-cycle">/ mo</span>';
    const currentPriceText = convertPrice(product.price);
    priceHtml = `
      <div class="product-card__price-wrap">
        <span class="price-prefix">From</span>
        <span class="product-price" data-price-bdt="${product.price}">${currentPriceText}</span>
        ${cycle}
      </div>
    `;
    ctaHtml = `
      <button class="btn-cart" type="button" data-add-to-cart data-id="${product.id}" aria-label="Buy ${product.title.replace(/"/g, '&quot;')}">Buy Now</button>
    `;
  }
  const fitClass  = product.imageFit === 'contain' ? ' card-image__photo--contain' : '';
  const photoHtml = imgCfg
    ? (() => {
        const errHandler = imgCfg.chain
          ? 'window.tryNextImageExt(this)'
          : 'this.remove()';
        const chainAttrs = imgCfg.chain
          ? `data-img-base="${imgCfg.base}" data-ext-idx="0"`
          : '';
        return `<img class="card-image__photo${fitClass}" src="${imgCfg.src}" alt="${product.title.replace(/"/g, '&quot;')}" loading="lazy" ${chainAttrs} onerror="${errHandler}">`;
      })()
    : '';

  return `
    <article class="product-card reveal" data-id="${product.id}" data-title="${product.title.toLowerCase()}" data-category="${product.category}">
      <div class="card-image" style="--ph-a:${c1};--ph-b:${c2};">
        ${avatarMarkup}
        ${photoHtml}
        ${badgeHtml}
        <div class="card-quick-overlay">
          <button class="btn-quick-preview" type="button" data-quick-view="${product.id}" aria-label="Quick view ${product.title.replace(/"/g, '&quot;')}">Quick View</button>
        </div>
      </div>
      <div class="card-body">
        <span class="card-cat">${CATEGORY_LABELS[product.category] || ''}</span>
        <h3 class="card-title" title="${product.title.replace(/"/g, '&quot;')}">${product.title}</h3>
        ${priceHtml}
        <div class="card-actions">${ctaHtml}</div>
      </div>
    </article>`;
}

function renderGrid(category) {
  const grid = $(`[data-grid="${category}"]`);
  if (!grid) return;
  const items = PRODUCTS.filter(p => p.category === category);
  grid.innerHTML = items.map(renderCard).join('');
}

/* ============================================================
   3D Tilt & Specular Glare Gesture Engine
   ============================================================ */
function initTiltGestures() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = $$('.product-card, .hero-preview-card, .why__item');
  
  cards.forEach(card => {
    let ticking = false;

    const onMove = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;

          // Limit tilt range for sleek professional feel
          const tiltX = (0.5 - y) * 14;
          const tiltY = (x - 0.5) * 14;

          card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
          card.style.setProperty('--glare-x', `${(x * 100).toFixed(1)}%`);
          card.style.setProperty('--glare-y', `${(y * 100).toFixed(1)}%`);
          ticking = false;
        });
        ticking = true;
      }
    };

    const onLeave = () => {
      card.style.transform = '';
      card.style.setProperty('--glare-x', '50%');
      card.style.setProperty('--glare-y', '50%');
    };

    card.addEventListener('pointermove', onMove, { passive: true });
    card.addEventListener('pointerleave', onLeave);
  });
}

/* ============================================================
   Magnetic Button Gesture
   ============================================================ */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;

  const magneticBtns = $$('.btn--primary, .brand, .site-header .icon-btn');
  
  magneticBtns.forEach(btn => {
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.22;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.22;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });

    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ============================================================
   Ambient Cursor Aura Light (Follows Pointer)
   ============================================================ */
function initCursorAura() {
  if (window.matchMedia('(hover: none)').matches) return;

  let aura = $('.cursor-aura');
  if (!aura) {
    aura = document.createElement('div');
    aura.className = 'cursor-aura';
    document.body.appendChild(aura);
  }

  let raf = null;
  window.addEventListener('pointermove', (e) => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      aura.style.left = `${e.clientX}px`;
      aura.style.top = `${e.clientY}px`;
    });
  }, { passive: true });
}

/* ============================================================
   Floating Capsule Dock (Category Tabs with Gliding Pill)
   ============================================================ */
function initCategoryTabs() {
  const tabs = $$('.cat-tab');
  const inner = $('.cat-tabs__inner');
  if (!tabs.length || !inner) return;

  let indicator = $('.cat-tab-indicator', inner);
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'cat-tab-indicator';
    inner.insertBefore(indicator, inner.firstChild);
  }

  const updateIndicator = (activeTab) => {
    if (!activeTab || !indicator) return;
    const tabRect = activeTab.getBoundingClientRect();
    const innerRect = inner.getBoundingClientRect();
    const left = tabRect.left - innerRect.left + inner.scrollLeft;
    indicator.style.left = `${left}px`;
    indicator.style.width = `${tabRect.width}px`;
  };

  const activeTab = $('.cat-tab.is-active', inner) || tabs[0];
  if (activeTab) updateIndicator(activeTab);

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      updateIndicator(tab);
    });
  });

  const sections = tabs
    .map(t => t.getAttribute('href'))
    .filter(h => h && h.startsWith('#'))
    .map(h => document.getElementById(h.slice(1)))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = '#' + e.target.id;
          const currentTab = tabs.find(t => t.getAttribute('href') === id);
          if (currentTab) {
            tabs.forEach(t => t.classList.remove('is-active'));
            currentTab.classList.add('is-active');
            updateIndicator(currentTab);
          }
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
  }

  window.addEventListener('resize', () => {
    const active = $('.cat-tab.is-active', inner);
    if (active) updateIndicator(active);
  }, { passive: true });
}

/* ============================================================
   Quick-Preview Drawer Modal
   ============================================================ */
function initQuickPreviewModal() {
  let modal = $('#quickPreviewModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quickPreviewModal';
    modal.className = 'quick-modal-backdrop';
    modal.setAttribute('aria-hidden', 'true');
    modal.hidden = true;
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="quick-modal-card" role="dialog" aria-modal="true" aria-labelledby="quickModalTitle">
        <button class="quick-modal-close" id="quickModalClose" aria-label="Close preview">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.88 18.3 9.17 12 2.88 5.71 4.3 4.29l6.29 6.3 6.3-6.3z"/></svg>
        </button>
        <div class="quick-modal__grid">
          <div class="quick-modal__img" id="quickModalImg"></div>
          <div class="quick-modal__details">
            <span class="eyebrow" id="quickModalCat">CATEGORY</span>
            <h2 id="quickModalTitle" style="font-size: 1.35rem; margin-block: 4px 6px;">Product Title</h2>
            <div id="quickModalPrice" style="margin-block: 6px 12px;"></div>
            <div class="quick-modal__features">
              <div class="quick-modal__feature-item">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>
                <span>100% Verified Authentic License</span>
              </div>
              <div class="quick-modal__feature-item">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>
                <span>Automated Instant Key / Account Dispatch</span>
              </div>
              <div class="quick-modal__feature-item">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>
                <span>Lifetime Updates &amp; Direct Setup Support</span>
              </div>
            </div>
            <div id="quickModalActions" style="display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap;"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const closeBtn = $('#quickModalClose', modal);
  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.hidden = true;
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-quick-view]');
    if (!trigger) return;
    const id = trigger.getAttribute('data-quick-view');
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    // Populate modal
    $('#quickModalCat', modal).textContent = CATEGORY_LABELS[product.category] || product.category;
    $('#quickModalTitle', modal).textContent = product.title;

    const priceEl = $('#quickModalPrice', modal);
    if (product.price === null || product.price === undefined) {
      priceEl.innerHTML = `<span class="price-badge price-badge--quote"><span class="pulse-dot"></span> Instant Quote</span>`;
    } else if (product.price === 0) {
      priceEl.innerHTML = `<div class="product-card__price-wrap"><span class="product-price" data-price-bdt="0">Free</span></div>`;
    } else {
      const cycle = product.cycle ? ` <span class="price-cycle">${product.cycle}</span>` : ' <span class="price-cycle">/ mo</span>';
      priceEl.innerHTML = `
        <div class="product-card__price-wrap">
          <span class="price-prefix">From</span>
          <span class="product-price" data-price-bdt="${product.price}">${convertPrice(product.price)}</span>
          ${cycle}
        </div>
      `;
    }

    const imgContainer = $('#quickModalImg', modal);
    const imgCfg = imageConfigFor(product);
    if (imgCfg) {
      imgContainer.innerHTML = `<img src="${imgCfg.src}" alt="${product.title.replace(/"/g, '&quot;')}" style="width:100%;height:100%;object-fit:cover;" onerror="this.remove()">`;
    } else {
      imgContainer.innerHTML = '';
    }

    const actionsContainer = $('#quickModalActions', modal);
    if (product.price === null || product.price === undefined) {
      actionsContainer.innerHTML = `
        <a class="btn btn--primary btn--block" data-quote-btn data-quote-title="${product.title.replace(/"/g, '&quot;')}" href="${callForPriceHref(product)}" target="_blank" rel="noopener">
          WhatsApp Instant Quote
        </a>
      `;
    } else {
      actionsContainer.innerHTML = `
        <button class="btn btn--primary" type="button" data-add-to-cart data-id="${product.id}" style="flex: 1;">
          Buy Now
        </button>
        <a class="btn btn--ghost" data-quote-btn data-quote-title="${product.title.replace(/"/g, '&quot;')}" href="${callForPriceHref(product)}" target="_blank" rel="noopener" style="flex: 1;">
          WhatsApp Buy
        </a>
      `;
    }

    modal.hidden = false;
    modal.style.display = 'flex';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
}

/* ============================================================
   Colorway Theme Switcher Engine
   ============================================================ */
function initColorwaySwitcher() {
  const savedColorway = localStorage.getItem('titan_colorway') || 'aurora';
  document.documentElement.setAttribute('data-colorway', savedColorway);

  // Wire up colorway options
  document.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-set-colorway]');
    if (!opt) return;
    const colorway = opt.getAttribute('data-set-colorway');
    document.documentElement.setAttribute('data-colorway', colorway);
    try { localStorage.setItem('titan_colorway', colorway); } catch {}
    
    // Close colorway menu if open
    const menu = $('#colorwayMenu');
    if (menu) menu.hidden = true;

    // Update active class on options
    $$('[data-set-colorway]').forEach(o => {
      o.classList.toggle('is-active', o.getAttribute('data-set-colorway') === colorway);
    });
  });

  const switcherBtn = $('#colorwayToggle');
  const menu = $('#colorwayMenu');
  if (switcherBtn && menu) {
    switcherBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.hidden = !menu.hidden;
    });
    document.addEventListener('click', () => {
      menu.hidden = true;
    });
  }
}

/* -----------------------------
   Sticky header shadow
   ----------------------------- */
function initStickyHeader() {
  const header = $('#siteHeader');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 50);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* -----------------------------
   Scroll reveal (IntersectionObserver)
   ----------------------------- */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    $$('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -30px 0px', threshold: 0.05 });

  $$('.cat-section, .why__item, .offer-card, .product-card, .section-head, .hero-preview-card').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
}

/* -----------------------------
   Mobile nav
   ----------------------------- */
function initMobileNav() {
  const nav     = $('#mobileNav');
  const opener  = $('#hamburger');
  const closer  = $('#mobileNavClose');
  if (!nav || !opener) return;

  let lastFocus = null;

  const open = () => {
    lastFocus = document.activeElement;
    nav.classList.add('is-open');
    nav.setAttribute('aria-hidden', 'false');
    opener.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    (closer || nav.querySelector('a')).focus();
  };
  const close = () => {
    nav.classList.remove('is-open');
    nav.setAttribute('aria-hidden', 'true');
    opener.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };

  opener.addEventListener('click', open);
  closer?.addEventListener('click', close);
  nav.addEventListener('click', (e) => { if (e.target.matches('a')) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
  });
}

/* -----------------------------
   Footer year
   ----------------------------- */
function initFooterYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
}

/* -----------------------------
   Shop page: filters, sort, results
   ----------------------------- */
function initShopPage() {
  const root = $('#shopRoot');
  if (!root) return;

  const grid       = $('[data-grid="shop"]', root);
  const countLabel = $('#shopCount', root);
  const sortSelect = $('#shopSort', root);
  const minRange   = $('#priceMin', root);
  const maxRange   = $('#priceMax', root);
  const minOut     = $('#priceMinOut', root);
  const maxOut     = $('#priceMaxOut', root);
  const search     = $('#shopSearch', root);
  const includeCall = $('#includeCall', root);

  const priced = PRODUCTS.filter(p => typeof p.price === 'number');
  const minPrice = 0;
  const maxPrice = Math.max(...priced.map(p => p.priceMax || p.price), 1000);

  minRange.min = maxRange.min = String(minPrice);
  minRange.max = maxRange.max = String(maxPrice);
  minRange.value = String(minPrice);
  maxRange.value = String(maxPrice);
  syncRangeOutputs();

  function syncRangeOutputs() {
    const lo = Math.min(+minRange.value, +maxRange.value);
    const hi = Math.max(+minRange.value, +maxRange.value);
    minOut.textContent = `৳${lo.toLocaleString('en-BD')}`;
    maxOut.textContent = `৳${hi.toLocaleString('en-BD')}`;
  }

  function selectedCategories() {
    return $$('input[name="cat"]:checked', root).map(i => i.value);
  }

  function applyFilters() {
    const cats   = selectedCategories();
    const lo     = Math.min(+minRange.value, +maxRange.value);
    const hi     = Math.max(+minRange.value, +maxRange.value);
    const q      = (search.value || '').toLowerCase().trim();
    const allowCall = includeCall.checked;
    const sort   = sortSelect.value;

    let list = PRODUCTS.slice();

    if (!cats.includes('all')) {
      list = list.filter(p => cats.includes(p.category));
    }

    if (q) list = list.filter(p => p.title.toLowerCase().includes(q));

    list = list.filter(p => {
      if (p.price === null) return allowCall;
      const eff = p.priceMax || p.price;
      return p.price >= lo && eff <= hi;
    });

    switch (sort) {
      case 'price-asc':  list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)); break;
      case 'price-desc': list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1)); break;
      case 'name-asc':   list.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'name-desc':  list.sort((a, b) => b.title.localeCompare(a.title)); break;
      default: break;
    }

    if (!list.length) {
      grid.innerHTML = `<div class="shop-empty"><h3>No products match.</h3><p>Try widening your price range or clearing filters.</p></div>`;
    } else {
      grid.innerHTML = list.map(renderCard).join('');
      $$('.product-card', grid).forEach(c => c.classList.add('is-visible'));
      initTiltGestures();
    }
    if (countLabel) countLabel.textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
  }

  $$('input[name="cat"]', root).forEach(input => {
    input.addEventListener('change', () => {
      if (input.value === 'all' && input.checked) {
        $$('input[name="cat"]', root).forEach(i => { if (i !== input) i.checked = false; });
      } else if (input.checked) {
        const allBox = $('input[name="cat"][value="all"]', root);
        if (allBox) allBox.checked = false;
      } else if (!$$('input[name="cat"]:checked', root).length) {
        const allBox = $('input[name="cat"][value="all"]', root);
        if (allBox) allBox.checked = true;
      }
      applyFilters();
    });
  });

  [minRange, maxRange].forEach(r => r.addEventListener('input', () => { syncRangeOutputs(); applyFilters(); }));
  search.addEventListener('input', applyFilters);
  includeCall.addEventListener('change', applyFilters);
  sortSelect.addEventListener('change', applyFilters);
  $('#resetFilters', root)?.addEventListener('click', () => {
    $$('input[name="cat"]', root).forEach(i => i.checked = i.value === 'all');
    minRange.value = String(minPrice);
    maxRange.value = String(maxPrice);
    search.value = '';
    includeCall.checked = true;
    sortSelect.value = 'relevance';
    syncRangeOutputs();
    applyFilters();
  });

  const syncHashFilter = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && CATEGORY_LABELS[hash]) {
      $$('input[name="cat"]', root).forEach(i => i.checked = false);
      const target = $(`input[name="cat"][value="${hash}"]`, root);
      if (target) target.checked = true;
      applyFilters();
    }
  };

  syncHashFilter();
  window.addEventListener('hashchange', syncHashFilter);
  applyFilters();
}

/* -----------------------------
   Theme Toggle (Dark/Light Mode)
   ----------------------------- */
function initThemeToggle() {
  const toggles = $$('#themeToggle, .theme-toggle, #themeModeToggle');
  if (!toggles.length) return;

  function updateUI() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    toggles.forEach(t => {
      const label = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
      t.setAttribute('aria-label', label);
      t.setAttribute('title', label);
      const modeLabel = t.querySelector('#themeModeLabel');
      if (modeLabel) modeLabel.textContent = label;
    });
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', target);
    try { localStorage.setItem('titan_theme', target); } catch {}
    updateUI();
  }

  toggles.forEach(t => t.addEventListener('click', toggle));
  updateUI();
}

/* -----------------------------
   Quick Category Filter Pills
   ----------------------------- */
function initFilterPills() {
  document.addEventListener('click', (e) => {
    const pill = e.target.closest('[data-filter-cat]');
    if (!pill) return;
    const cat = pill.getAttribute('data-filter-cat');
    if (!cat) return;

    $$('[data-filter-cat]').forEach(p => p.classList.toggle('is-active', p === pill));

    const section = document.getElementById(cat);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const tab = $(`[data-category="${cat}"]`);
      if (tab) tab.click();
      return;
    }

    const shopBtn = $(`[data-shop-cat="${cat}"]`);
    if (shopBtn) {
      shopBtn.click();
      return;
    }

    const inPages = window.location.pathname.includes('/pages/');
    window.location.href = inPages ? `shop.html?cat=${cat}` : `pages/shop.html?cat=${cat}`;
  });
}

/* -----------------------------
   Interactive Glassmorphic Checkout & Payment Verification Engine
   ----------------------------- */
function initCheckoutModal() {
  const modal = $('#checkoutModal');
  if (!modal) return;

  const closeBtn = $('#closeCheckoutModal');
  const nameEl = $('#checkoutProductName');
  const cycleEl = $('#checkoutProductCycle');
  const priceEl = $('#checkoutPayableAmount');
  const usdtEl = $('#checkoutUsdtEquivalent');
  const tabs = $$('.payment-tab', modal);
  const instructionEl = $('#paymentInstructionText');
  const accountLabelEl = $('#paymentAccountLabel');
  const accountValEl = $('#paymentAccountValue');
  const cryptoRowEl = $('#cryptoWalletRow');
  const cryptoValEl = $('#cryptoWalletValue');
  const copyAccountBtn = $('#copyPaymentAccountBtn');
  const copyCryptoBtn = $('#copyCryptoWalletBtn');
  const form = $('#trxVerificationForm');
  const senderLabelEl = $('#senderAccountLabel');
  const senderInputEl = $('#senderAccount');
  const trxLabelEl = $('#trxIdLabel');
  const trxInputEl = $('#transactionId');

  let activeMethod = 'bkash';

  const updateMethodDetails = (method) => {
    activeMethod = method;
    tabs.forEach(tab => {
      const isActive = tab.getAttribute('data-method') === method;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (method === 'bkash') {
      if (instructionEl) instructionEl.textContent = PAYMENT_CONFIG.bkash.instructions;
      if (accountLabelEl) accountLabelEl.textContent = 'bKash Personal (Send Money)';
      if (accountValEl) accountValEl.textContent = PAYMENT_CONFIG.bkash.number;
      if (senderLabelEl) senderLabelEl.textContent = 'Sender bKash Number *';
      if (senderInputEl) senderInputEl.placeholder = 'e.g., 01711280684';
      if (trxLabelEl) trxLabelEl.textContent = 'bKash Transaction ID (TrxID) *';
      if (trxInputEl) trxInputEl.placeholder = 'e.g., BJI84K92LM';
      if (cryptoRowEl) cryptoRowEl.hidden = true;
    } else if (method === 'nagad') {
      if (instructionEl) instructionEl.textContent = PAYMENT_CONFIG.nagad.instructions;
      if (accountLabelEl) accountLabelEl.textContent = 'Nagad Personal (Send Money)';
      if (accountValEl) accountValEl.textContent = PAYMENT_CONFIG.nagad.number;
      if (senderLabelEl) senderLabelEl.textContent = 'Sender Nagad Number *';
      if (senderInputEl) senderInputEl.placeholder = 'e.g., 01711280684';
      if (trxLabelEl) trxLabelEl.textContent = 'Nagad Transaction ID (TrxID) *';
      if (trxInputEl) trxInputEl.placeholder = 'e.g., BJI84K92LM';
      if (cryptoRowEl) cryptoRowEl.hidden = true;
    } else if (method === 'binance') {
      if (instructionEl) instructionEl.textContent = PAYMENT_CONFIG.binance.instructions;
      if (accountLabelEl) accountLabelEl.textContent = 'BinancePay ID (0% Fee)';
      if (accountValEl) accountValEl.textContent = PAYMENT_CONFIG.binance.payId;
      if (cryptoRowEl) {
        const cryptoLabelEl = cryptoRowEl.querySelector('.payment-copy-label');
        if (cryptoLabelEl) cryptoLabelEl.textContent = 'USDT Wallet (BNB Smart Chain)';
      }
      if (cryptoValEl) cryptoValEl.textContent = PAYMENT_CONFIG.binance.walletAddress;
      if (senderLabelEl) senderLabelEl.textContent = 'Your Binance ID / Wallet *';
      if (senderInputEl) senderInputEl.placeholder = 'e.g., 570493144 or 0x...';
      if (trxLabelEl) trxLabelEl.textContent = 'Binance Order ID / TxHash *';
      if (trxInputEl) trxInputEl.placeholder = 'e.g., 294810482 or TxHash';
      if (cryptoRowEl) cryptoRowEl.hidden = false;
    }
  };

  const openModal = (productData) => {
    if (!productData) return;
    const priceBdt = Number(productData.priceBdt || 0);
    const usdtAmount = (priceBdt * PAYMENT_CONFIG.binance.usdtRate).toFixed(2);

    if (nameEl) nameEl.textContent = productData.name || 'ChatGPT Plus Subscription';
    if (cycleEl) cycleEl.textContent = productData.cycle || '1 Month Access';
    if (priceEl) {
      priceEl.textContent = `৳${priceBdt.toLocaleString('en-BD')}`;
      priceEl.setAttribute('data-base-bdt', String(priceBdt));
    }
    if (usdtEl) usdtEl.textContent = `≈ $${usdtAmount} USDT`;

    // Restore form if success screen was showing
    const successView = $('.checkout-success-view', modal);
    if (successView) successView.remove();
    if (form) {
      form.hidden = false;
      form.style.display = '';
      form.reset();
    }

    updateMethodDetails(activeMethod || 'bkash');

    modal.hidden = false;
    modal.removeAttribute('hidden');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.hidden = true;
    modal.setAttribute('hidden', '');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Tab switcher
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const method = tab.getAttribute('data-method');
      if (method) updateMethodDetails(method);
    });
  });

  // Copy button handlers
  const handleCopy = (btn, textFn) => {
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const val = textFn();
      if (!val) return;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(val);
        } else {
          const ta = document.createElement('textarea');
          ta.value = val;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        const span = $('span', btn) || btn;
        const originalText = span.textContent;
        span.textContent = 'Copied! ✓';
        btn.classList.add('is-copied');
        setTimeout(() => {
          span.textContent = originalText;
          btn.classList.remove('is-copied');
        }, 1800);
      } catch (err) {
        console.error('Clipboard copy failed', err);
      }
    });
  };

  handleCopy(copyAccountBtn, () => accountValEl ? accountValEl.textContent.trim() : '');
  handleCopy(copyCryptoBtn, () => cryptoValEl ? cryptoValEl.textContent.trim() : '');

  // Form Submission & WhatsApp Order Verification Receipt
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerEmail = ($('#customerEmail', form)?.value || '').trim();
      const senderAccount = ($('#senderAccount', form)?.value || '').trim();
      const trxId = ($('#transactionId', form)?.value || '').trim();

      if (!customerEmail || !senderAccount || !trxId) return;

      const orderId = 'TDS-' + Math.floor(100000 + Math.random() * 900000);
      const productName = (nameEl?.textContent || 'Digital Product').trim();
      const productCycle = (cycleEl?.textContent || 'Access').trim();
      const priceBdt = priceEl?.getAttribute('data-base-bdt') || priceEl?.textContent.replace(/[^\d]/g, '') || '0';
      const usdtAmount = (Number(priceBdt) * PAYMENT_CONFIG.binance.usdtRate).toFixed(2);
      const selectedMethod = activeMethod || 'bkash';

      const message = `*⚡ NEW ORDER VERIFICATION — TITAN DIGISTACK*\n*Order ID:* #${orderId}\n*Product:* ${productName} (${productCycle})\n*Amount:* ৳${priceBdt} (${usdtAmount} USDT)\n*Payment Method:* ${selectedMethod.toUpperCase()}\n*Sender Account:* ${senderAccount}\n*TrxID / Order ID:* ${trxId}\n*Delivery Email:* ${customerEmail}`;

      const adminPhone = (window.STORE_CONFIG && window.STORE_CONFIG.whatsappNumber) || (PAYMENT_CONFIG.whatsappAdmin || '').replace(/\D/g, '') || '16728952770';
      const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener');

      // In-modal success confirmation view
      form.hidden = true;
      form.style.display = 'none';

      let successView = $('.checkout-success-view', modal);
      if (!successView) {
        successView = document.createElement('div');
        successView.className = 'checkout-success-view';
        form.parentNode.insertBefore(successView, form.nextSibling);
      }
      successView.innerHTML = `
        <div class="checkout-success-icon">✓</div>
        <h4>Order Verification Dispatched!</h4>
        <p>Your payment verification and TrxID have been submitted for automated license provisioning.</p>
        <div class="checkout-order-chip">Order ID: #${orderId}</div>
        <p style="font-size:0.8rem;color:rgba(255,255,255,0.65);margin-bottom:14px;">WhatsApp verification opened in a new tab. Instant digital key delivery will arrive via email at <strong>${customerEmail}</strong>.</p>
        <button type="button" class="checkout-submit-btn" id="checkoutSuccessDoneBtn">
          <span>Done &amp; Close</span>
        </button>
      `;

      $('#checkoutSuccessDoneBtn', successView)?.addEventListener('click', closeModal);
    });
  }

  // Close handlers
  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // Global listener for "Pay in Advance" and TrxID Verification triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('#openAdvancePayModalBtn, [data-open-checkout-modal], #footerVerifyTrxLink');
    if (!trigger) return;
    e.preventDefault();

    if (typeof window.closeCartDrawer === 'function') {
      window.closeCartDrawer();
    }

    const cart = window.TitanCart;
    const count = cart && cart.totalCount ? cart.totalCount() : 0;
    if (count > 0) {
      const cartItems = cart.items();
      const bundleName = cartItems.length === 1
        ? cartItems[0].title
        : `${cartItems[0].title} + ${cartItems.length - 1} more items`;
      openModal({
        name: bundleName,
        cycle: `${count} Item(s) in Stack`,
        priceBdt: cart.totalAmount()
      });
    } else {
      openModal({
        name: 'Direct License Key Order',
        cycle: 'Instant 1 Month Access',
        priceBdt: 350
      });
    }
  });

  window.openCheckoutModal = openModal;
  window.closeCheckoutModal = closeModal;
}

/* -----------------------------
   Boot
   ----------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  Object.keys(CATEGORY_LABELS).forEach(renderGrid);

  initStickyHeader();
  initThemeToggle();
  initColorwaySwitcher();
  initCurrencySwitcher();
  initFilterPills();
  initCategoryTabs();
  initTiltGestures();
  initMagneticButtons();
  initCursorAura();
  initQuickPreviewModal();
  initCheckoutModal();
  initScrollReveal();
  initMobileNav();
  initFooterYear();
  initShopPage();

  document.dispatchEvent(new CustomEvent('titan:products-rendered'));
});
