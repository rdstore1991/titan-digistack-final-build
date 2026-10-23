/* ============================================================
   Titan DigiStack — cart.js
   - Persistent Cart state (titan_cart / titan_cart_v1)
   - Cart-First "Buy Now" engine
   - Slide-Over Cart Drawer (#cartDrawer)
   - Dual Checkout (WhatsApp Primary + Advance Payment Modal)
   - Real-time Currency Conversion (BDT, INR, USD)
   ============================================================ */

(function () {
  const STORAGE_KEY_PRIMARY = 'titan_cart';
  const STORAGE_KEY_LEGACY = 'titan_cart_v1';

  /** @type {Record<string, number>} id -> quantity */
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PRIMARY) || localStorage.getItem(STORAGE_KEY_LEGACY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function save() {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY_PRIMARY, serialized);
      localStorage.setItem(STORAGE_KEY_LEGACY, serialized);
    } catch {}
  }

  function getProduct(id) {
    return (window.PRODUCTS || []).find(p => p.id === id);
  }

  function totalCount() {
    return Object.values(state).reduce((a, b) => a + b, 0);
  }

  function totalAmount() {
    return Object.entries(state).reduce((sum, [id, qty]) => {
      const p = getProduct(id);
      if (!p || p.price === null || p.price === undefined) return sum;
      return sum + p.price * qty;
    }, 0);
  }

  function items() {
    return Object.entries(state)
      .map(([id, qty]) => ({ ...getProduct(id), id, qty }))
      .filter(p => p.title);
  }

  function fmtActiveCurrency(amount) {
    if (typeof window.convertPrice === 'function') {
      return window.convertPrice(amount);
    }
    return `৳${Number(amount).toLocaleString('en-BD')}`;
  }

  function placeholderInitials(title) {
    const words = (title || '').replace(/[^a-z0-9 ]/gi, ' ').trim().split(/\s+/);
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'TD';
  }

  function showToast(product) {
    let toast = document.getElementById('cartToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cartToast';
      toast.className = 'cart-toast';
      toast.innerHTML = `
        <div class="cart-toast__icon">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
        <div class="cart-toast__content">
          <h4 id="cartToastTitle">Added to Stack ✓</h4>
          <p id="cartToastSubtitle">Instant digital delivery ready</p>
        </div>
      `;
      document.body.appendChild(toast);
    }

    const titleEl = document.getElementById('cartToastTitle');
    const subEl = document.getElementById('cartToastSubtitle');
    if (titleEl && product) titleEl.textContent = `Added: ${product.title}`;
    if (subEl && product) subEl.textContent = `Stack total: ${fmtActiveCurrency(totalAmount())}`;

    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  function add(id) {
    const p = getProduct(id);
    if (!p || p.price === null || p.price === undefined) return false;
    state[id] = (state[id] || 0) + 1;
    save();
    render();
    showToast(p);

    // Open Cart Drawer automatically unless already on dedicated cart page
    if (!window.location.pathname.includes('cart.html')) {
      openCartDrawer();
    }
    return true;
  }

  function setQty(id, qty) {
    if (qty <= 0) return remove(id);
    state[id] = qty;
    save();
    render();
  }

  function remove(id) {
    delete state[id];
    save();
    render();
  }

  function clear() {
    state = {};
    save();
    render();
  }

  /** Update badges across header and mobile bar */
  function updateBadges() {
    const count = totalCount();
    ['cartCount', 'mobileCartCount'].forEach(id => {
      const badge = document.getElementById(id);
      if (badge) {
        badge.textContent = String(count);
        badge.classList.add('is-bumped');
        setTimeout(() => badge.classList.remove('is-bumped'), 300);
      }
    });
  }

  /** Slide-Over Cart Drawer Open / Close */
  function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    renderCartDrawer();
    drawer.hidden = false;
    drawer.removeAttribute('hidden');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    drawer.hidden = true;
    drawer.setAttribute('hidden', '');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  window.openCartDrawer = openCartDrawer;
  window.closeCartDrawer = closeCartDrawer;

  /** Render items into Slide-Over Cart Drawer */
  function renderCartDrawer() {
    const listEl = document.getElementById('cartDrawerList');
    const countEl = document.getElementById('cartDrawerCount');
    const totalEl = document.getElementById('cartDrawerTotal');
    if (!listEl) return;

    const lines = items();
    const count = totalCount();
    const total = totalAmount();

    if (countEl) countEl.textContent = String(count);
    if (totalEl) totalEl.textContent = fmtActiveCurrency(total);

    const waBtn = document.getElementById('whatsappCheckoutBtn');
    const advBtn = document.getElementById('openAdvancePayModalBtn');

    if (!lines.length) {
      listEl.innerHTML = `
        <div class="cart-drawer__empty">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 12px; opacity: 0.4;">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path>
          </svg>
          <h4>Your Stack is Empty</h4>
          <p style="font-size: 0.85rem; margin-bottom: 14px;">Browse verified digital licenses and tools to get started.</p>
          <button type="button" class="btn btn--sm btn--primary" onclick="window.closeCartDrawer && window.closeCartDrawer()">Explore Catalog</button>
        </div>
      `;
      if (waBtn) waBtn.setAttribute('disabled', 'true');
      if (advBtn) advBtn.setAttribute('disabled', 'true');
      return;
    }

    if (waBtn) waBtn.removeAttribute('disabled');
    if (advBtn) advBtn.removeAttribute('disabled');

    listEl.innerHTML = lines.map(line => {
      const lineTotal = (line.price || 0) * line.qty;
      const priceText = fmtActiveCurrency(lineTotal);
      const avatar = (typeof window.getBrandAvatar === 'function')
        ? window.getBrandAvatar(line.title, line.category)
        : ((typeof window.getCategoryFallbackSVG === 'function') ? window.getCategoryFallbackSVG(line.category) : '');

      return `
        <div class="cart-drawer__item" data-id="${line.id}">
          <div class="cart-drawer__item-img" aria-hidden="true">${avatar}</div>
          <div class="cart-drawer__item-info">
            <h4>${line.title}</h4>
            <span class="cart-drawer__item-cycle">${line.cycle || '1 Month Access'}</span>
            <div class="cart-drawer__item-qty">
              <button type="button" class="cart-drawer__qty-btn" data-cart-qty-dec aria-label="Decrease quantity">−</button>
              <span class="cart-drawer__qty-val">${line.qty}</span>
              <button type="button" class="cart-drawer__qty-btn" data-cart-qty-inc aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="cart-drawer__item-actions">
            <div class="cart-drawer__item-price">${priceText}</div>
            <button type="button" class="cart-drawer__item-remove" data-cart-remove aria-label="Remove ${line.title}">Remove</button>
          </div>
        </div>
      `;
    }).join('');
  }

  /** Render items into dedicated Cart Page (pages/cart.html) */
  function renderCartPage() {
    const list    = document.getElementById('cartList');
    const summary = document.getElementById('cartSummaryBody');
    if (!list || !summary) return;

    const lines = items();
    const count = totalCount();
    const subtotal = totalAmount();

    const waBtn = document.getElementById('whatsappCheckoutBtn');
    const advBtn = document.getElementById('openAdvancePayModalBtn');
    const legacyCheckout = document.getElementById('checkoutBtn');

    if (!lines.length) {
      list.innerHTML = `
        <div class="cart-empty">
          <h3>Your cart is empty.</h3>
          <p>Browse our verified digital tool stack and add items to get started.</p>
          <a href="../index.html" class="btn btn--primary" style="margin-top:16px;">Explore Storefront</a>
        </div>`;
      summary.innerHTML = `<dl><dt>Items</dt><dd>0</dd><dt>Subtotal</dt><dd>${fmtActiveCurrency(0)}</dd></dl>
        <dl class="cart-total"><dt>Total</dt><dd>${fmtActiveCurrency(0)}</dd></dl>`;
      if (waBtn) waBtn.setAttribute('disabled', 'true');
      if (advBtn) advBtn.setAttribute('disabled', 'true');
      if (legacyCheckout) legacyCheckout.setAttribute('aria-disabled', 'true');
      return;
    }

    if (waBtn) waBtn.removeAttribute('disabled');
    if (advBtn) advBtn.removeAttribute('disabled');
    if (legacyCheckout) legacyCheckout.removeAttribute('aria-disabled');

    list.innerHTML = lines.map(line => {
      const imgCfg = (typeof window.imageConfigFor === 'function') ? window.imageConfigFor(line) : null;
      let thumb;
      if (imgCfg) {
        const errHandler = imgCfg.chain
          ? `this.src!==this.dataset.imgBase+'.webp'?window.tryNextImageExt(this):this.closest('.cart-row__img').dataset.fallback='1'`
          : `this.remove()`;
        const chainAttrs = imgCfg.chain
          ? `data-img-base="${imgCfg.base}" data-ext-idx="0"`
          : '';
        thumb = `<div class="cart-row__img"><img src="${imgCfg.src}" alt="${(line.title || '').replace(/"/g, '&quot;')}" loading="lazy" ${chainAttrs} onerror="${errHandler}"></div>`;
      } else {
        thumb = `<div class="cart-row__img" aria-hidden="true">${typeof window.getBrandAvatar === 'function' ? window.getBrandAvatar(line.title, line.category) : ((typeof window.getCategoryFallbackSVG === 'function') ? window.getCategoryFallbackSVG(line.category) : '')}</div>`;
      }
      return `
      <div class="cart-row" data-id="${line.id}">
        ${thumb}
        <div>
          <div class="cart-row__cat">${(window.CATEGORY_LABELS || {})[line.category] || ''}</div>
          <div class="cart-row__title">${line.title}</div>
          <div class="cart-row__qty">
            <button class="qty-btn" type="button" data-qty-dec aria-label="Decrease quantity">−</button>
            <input class="qty-input" type="number" min="1" value="${line.qty}" aria-label="Quantity for ${line.title}">
            <button class="qty-btn" type="button" data-qty-inc aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div>
          <div class="cart-row__price">${fmtActiveCurrency((line.price || 0) * line.qty)}</div>
          <button class="cart-row__remove" type="button" data-remove aria-label="Remove ${line.title}">Remove</button>
        </div>
      </div>`;
    }).join('');

    summary.innerHTML = `
      <dl>
        <dt>Items</dt><dd>${count}</dd>
        <dt>Subtotal</dt><dd>${fmtActiveCurrency(subtotal)}</dd>
        <dt>Delivery</dt><dd style="color:var(--color-accent-emerald);font-weight:600;">Instant Digital Key</dd>
      </dl>
      <dl class="cart-total"><dt>Total</dt><dd>${fmtActiveCurrency(subtotal)}</dd></dl>`;
  }

  function render() {
    updateBadges();
    renderCartDrawer();
    renderCartPage();
    document.dispatchEvent(new CustomEvent('titan:cart-changed', {
      detail: { items: items(), count: totalCount(), total: totalAmount() }
    }));
  }

  /* -----------------------------
     Event Delegation
     ----------------------------- */
  document.addEventListener('click', (e) => {
    // 1. "Buy Now" / "Add to Cart" buttons
    const addBtn = e.target.closest('[data-add-to-cart]');
    if (addBtn) {
      if (addBtn.classList.contains('call') || addBtn.hasAttribute('data-quote-btn')) return;
      const id = addBtn.dataset.id || addBtn.getAttribute('data-id');
      if (id && add(id)) {
        addBtn.classList.add('is-added');
        const originalText = addBtn.textContent;
        addBtn.textContent = 'Added ✓';
        setTimeout(() => {
          addBtn.classList.remove('is-added');
          addBtn.textContent = originalText;
        }, 1500);
      }
      return;
    }

    // 2. Cart Icon Click in Header or Mobile Bar -> Open Drawer (unless on cart page)
    const cartIcon = e.target.closest('#cartButton, #headerCartBtn, [data-open-cart]');
    if (cartIcon) {
      if (!window.location.pathname.includes('cart.html')) {
        e.preventDefault();
        openCartDrawer();
      }
      return;
    }

    // 3. Close Cart Drawer Button or Overlay Background
    if (e.target.closest('#closeCartDrawer') || e.target.id === 'cartDrawer') {
      closeCartDrawer();
      return;
    }

    // 4. Cart Drawer Quantity Controls
    const drawerItem = e.target.closest('.cart-drawer__item');
    if (drawerItem) {
      const id = drawerItem.dataset.id;
      if (e.target.matches('[data-cart-qty-inc]')) {
        setQty(id, (state[id] || 0) + 1);
        return;
      }
      if (e.target.matches('[data-cart-qty-dec]')) {
        setQty(id, (state[id] || 0) - 1);
        return;
      }
      if (e.target.matches('[data-cart-remove]')) {
        remove(id);
        return;
      }
    }

    // 5. Dedicated Cart Page Quantity Controls
    const row = e.target.closest('.cart-row');
    if (row) {
      const id = row.dataset.id;
      if (e.target.matches('[data-qty-inc]')) {
        setQty(id, (state[id] || 0) + 1);
        return;
      }
      if (e.target.matches('[data-qty-dec]')) {
        setQty(id, (state[id] || 0) - 1);
        return;
      }
      if (e.target.matches('[data-remove]')) {
        remove(id);
        return;
      }
    }

    // 6. PRIMARY CHECKOUT: WhatsApp Instant Order
    const waCheckout = e.target.closest('#whatsappCheckoutBtn, #checkoutBtn');
    if (waCheckout) {
      e.preventDefault();
      if (!totalCount()) return;

      const orderId = 'TDS-' + Math.floor(100000 + Math.random() * 900000);
      const curr = (typeof window.getActiveCurrency === 'function') ? window.getActiveCurrency() : 'BDT';
      const lines = items().map(l => {
        const lTotal = (l.price || 0) * l.qty;
        const linePrice = (typeof window.convertPrice === 'function') ? window.convertPrice(lTotal, curr) : `৳${lTotal}`;
        return `• ${l.title} × ${l.qty} = ${linePrice}`;
      }).join('\n');

      const totalFormatted = fmtActiveCurrency(totalAmount());
      const orderSummaryText = `*⚡ NEW ORDER — TITAN DIGISTACK*\n*Order ID:* #${orderId}\n\n*Items in Stack:*\n${lines}\n\n*Total Payable:* ${totalFormatted} (${curr})\n*Payment Method:* Direct WhatsApp Instant Order\n\nPlease confirm key dispatch details!`;

      const num = (window.STORE_CONFIG && window.STORE_CONFIG.whatsappNumber) || '16728952770';
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(orderSummaryText)}`, '_blank', 'noopener');
      return;
    }

    // 7. SECONDARY CHECKOUT: Pay in Advance Modal Trigger
    const advCheckout = e.target.closest('#openAdvancePayModalBtn');
    if (advCheckout) {
      e.preventDefault();
      if (!totalCount()) return;
      closeCartDrawer();

      if (typeof window.openCheckoutModal === 'function') {
        const cartItems = items();
        const bundleName = cartItems.length === 1
          ? cartItems[0].title
          : `${cartItems[0].title} + ${cartItems.length - 1} more items`;
        window.openCheckoutModal({
          name: bundleName,
          cycle: `${totalCount()} Item(s) in Stack`,
          priceBdt: totalAmount()
        });
      }
      return;
    }
  });

  document.addEventListener('input', (e) => {
    if (!e.target.matches('.cart-row .qty-input')) return;
    const row = e.target.closest('.cart-row');
    if (!row) return;
    const n = Math.max(1, parseInt(e.target.value, 10) || 1);
    setQty(row.dataset.id, n);
  });

  document.getElementById('clearCartBtn')?.addEventListener('click', () => {
    if (confirm('Remove all items from your cart?')) clear();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const drawer = document.getElementById('cartDrawer');
      if (drawer && !drawer.hidden) closeCartDrawer();
    }
  });

  // Sync across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY_PRIMARY || e.key === STORAGE_KEY_LEGACY) {
      state = load();
      render();
    }
  });

  // Re-render when currency changes
  document.addEventListener('titan:currency-changed', () => {
    renderCartDrawer();
    renderCartPage();
  });

  document.addEventListener('DOMContentLoaded', () => {
    render();
  });

  window.TitanCart = {
    add,
    remove,
    setQty,
    clear,
    items,
    totalCount,
    totalAmount,
    openCartDrawer,
    closeCartDrawer,
    renderCartDrawer
  };
})();
