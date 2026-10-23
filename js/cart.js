/* ============================================================
   Titan DigiStack — cart.js
   Cart state, localStorage persistence, header badge, add/remove.
   Toast notifications, tactile bounce feedback, WhatsApp checkout.
   ============================================================ */

(function () {
  const STORAGE_KEY = 'titan_cart_v1';

  /** @type {Record<string, number>} id -> quantity */
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
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
      if (!p || p.price === null) return sum;
      return sum + p.price * qty;
    }, 0);
  }

  function items() {
    return Object.entries(state)
      .map(([id, qty]) => ({ ...getProduct(id), id, qty }))
      .filter(p => p.title);
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
          <h4 id="cartToastTitle">Added to Stack</h4>
          <p id="cartToastSubtitle">Instant digital delivery ready</p>
        </div>
      `;
      document.body.appendChild(toast);
    }

    const titleEl = document.getElementById('cartToastTitle');
    const subEl = document.getElementById('cartToastSubtitle');
    if (titleEl && product) titleEl.textContent = `Added: ${product.title}`;
    if (subEl && product) subEl.textContent = `Cart subtotal: ৳${totalAmount().toLocaleString('en-BD')}`;

    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  function add(id) {
    const p = getProduct(id);
    if (!p || p.price === null) return false;
    state[id] = (state[id] || 0) + 1;
    save(); 
    render();
    showToast(p);
    return true;
  }

  function setQty(id, qty) {
    if (qty <= 0) return remove(id);
    state[id] = qty;
    save(); render();
  }

  function remove(id) {
    delete state[id];
    save(); render();
  }

  function clear() {
    state = {};
    save(); render();
  }

  /** Update cart badge + dispatch custom event */
  function render() {
    const count = totalCount();
    ['cartCount', 'mobileCartCount'].forEach(id => {
      const badge = document.getElementById(id);
      if (badge) {
        badge.textContent = String(count);
        badge.classList.add('is-bumped');
        setTimeout(() => badge.classList.remove('is-bumped'), 300);
      }
    });
    document.dispatchEvent(new CustomEvent('titan:cart-changed', {
      detail: { items: items(), count: totalCount(), total: totalAmount() }
    }));
  }

  /* Wire add-to-cart buttons across the document via delegation */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;
    const id = btn.dataset.id;
    if (add(id)) {
      btn.classList.add('is-added');
      const originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(() => {
        btn.classList.remove('is-added');
        btn.textContent = originalText;
      }, 1500);
    }
  });

  /* Sync across tabs */
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) { state = load(); render(); }
  });

  document.addEventListener('DOMContentLoaded', render);

  /* Cart page rendering ---------------------------------- */
  function fmtBDT(n) { return `৳${Number(n).toLocaleString('en-BD')}`; }

  function placeholderInitials(title) {
    const words = (title || '').replace(/[^a-z0-9 ]/gi, ' ').trim().split(/\s+/);
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'TD';
  }

  function renderCartPage() {
    const list    = document.getElementById('cartList');
    const summary = document.getElementById('cartSummaryBody');
    if (!list || !summary) return;

    const lines = items();

    if (!lines.length) {
      list.innerHTML = `
        <div class="cart-empty">
          <h3>Your cart is empty.</h3>
          <p>Browse our verified digital tool stack and add items to get started.</p>
          <a href="../index.html" class="btn btn--primary" style="margin-top:16px;">Explore Storefront</a>
        </div>`;
      summary.innerHTML = `<dl><dt>Items</dt><dd>0</dd><dt>Subtotal</dt><dd>৳0</dd></dl>
        <dl class="cart-total"><dt>Total</dt><dd>৳0</dd></dl>`;
      const checkout = document.getElementById('checkoutBtn');
      if (checkout) checkout.setAttribute('aria-disabled', 'true');
      return;
    }

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
        thumb = `<div class="cart-row__img" aria-hidden="true">${placeholderInitials(line.title)}</div>`;
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
          <div class="cart-row__price">${fmtBDT((line.price || 0) * line.qty)}</div>
          <button class="cart-row__remove" type="button" data-remove aria-label="Remove ${line.title}">Remove</button>
        </div>
      </div>`;
    }).join('');

    const subtotal = totalAmount();
    const itemsCount = totalCount();
    summary.innerHTML = `
      <dl>
        <dt>Items</dt><dd>${itemsCount}</dd>
        <dt>Subtotal</dt><dd>${fmtBDT(subtotal)}</dd>
        <dt>Delivery</dt><dd style="color:var(--color-accent-emerald);font-weight:600;">Instant Digital Key</dd>
      </dl>
      <dl class="cart-total"><dt>Total</dt><dd>${fmtBDT(subtotal)}</dd></dl>`;

    const checkout = document.getElementById('checkoutBtn');
    if (checkout) checkout.removeAttribute('aria-disabled');
  }

  document.addEventListener('click', (e) => {
    const row = e.target.closest('.cart-row');
    if (!row) return;
    const id = row.dataset.id;
    if (e.target.matches('[data-qty-inc]')) {
      const cur = state[id] || 0;
      setQty(id, cur + 1);
    } else if (e.target.matches('[data-qty-dec]')) {
      const cur = state[id] || 0;
      setQty(id, cur - 1);
    } else if (e.target.matches('[data-remove]')) {
      remove(id);
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

  document.getElementById('checkoutBtn')?.addEventListener('click', (e) => {
    if (!totalCount()) { e.preventDefault(); return; }
    const num = (window.TITAN_CONFIG && window.TITAN_CONFIG.whatsappNumber) || '8801700000000';
    const lines = items().map(l => `• ${l.title} × ${l.qty} = ৳${((l.price||0)*l.qty).toLocaleString('en-BD')}`).join('\n');
    const total = totalAmount();
    const msg = encodeURIComponent(`Hi Titan DigiStack, I'd like to place this order:\n\n${lines}\n\nTotal: ৳${total.toLocaleString('en-BD')}`);
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank', 'noopener');
  });

  document.addEventListener('titan:cart-changed', renderCartPage);
  document.addEventListener('DOMContentLoaded', renderCartPage);

  window.TitanCart = { add, remove, setQty, clear, items, totalCount, totalAmount };
})();
