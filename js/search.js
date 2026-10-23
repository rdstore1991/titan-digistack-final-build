/* ============================================================
   Titan DigiStack — search.js
   - Live filter of product cards on keyup (no reload)
   - Header search dropdown with keyboard nav (↑ ↓ Enter Esc)
   ============================================================ */

(function () {
  const input    = document.getElementById('siteSearch');
  const dropdown = document.getElementById('searchResults');
  if (!input) return;

  let active = -1; // active suggestion index

  function getCatalog() {
    return (window.PRODUCTS || []).map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      catLabel: (window.CATEGORY_LABELS || {})[p.category] || p.category,
    }));
  }

  function match(q, list) {
    const needle = q.toLowerCase().trim();
    if (!needle) return [];
    return list.filter(p => p.title.toLowerCase().includes(needle)).slice(0, 8);
  }

  function resolveCategoryLink(category) {
    const path = window.location.pathname.replace(/\\/g, '/');
    const inPages = path.includes('/pages/');
    const isShop = path.endsWith('shop.html') || path.endsWith('/shop');

    if (isShop) return `shop.html#${category}`;
    if (inPages) return `../index.html#${category}`;
    return `#${category}`;
  }

  function renderDropdown(results) {
    if (!dropdown) return;
    if (!results.length) {
      dropdown.hidden = false;
      dropdown.innerHTML = `<li><div class="search__empty">No matches. Try “elementor”, “canva”, or “seo”.</div></li>`;
      return;
    }
    dropdown.hidden = false;
    dropdown.innerHTML = results.map((r, i) => `
      <li role="option" data-id="${r.id}" data-cat="${r.category}" ${i === active ? 'class="is-active"' : ''}>
        <a href="${resolveCategoryLink(r.category)}">
          <span>${r.title}</span>
          <span class="res-cat">${r.catLabel}</span>
        </a>
      </li>`).join('');
  }

  function hideDropdown() {
    if (dropdown) { dropdown.hidden = true; dropdown.innerHTML = ''; }
    active = -1;
  }

  /* Live filter of every product-card on the page */
  function filterGrids(q) {
    const needle = q.toLowerCase().trim();
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      const title = card.dataset.title || '';
      const hit = !needle || title.includes(needle);
      card.classList.toggle('is-hidden', !hit);
    });
  }

  input.addEventListener('input', () => {
    const q = input.value;
    const results = match(q, getCatalog());
    if (q.trim()) renderDropdown(results); else hideDropdown();
    filterGrids(q);
  });

  input.addEventListener('keydown', (e) => {
    if (!dropdown || dropdown.hidden) return;
    const items = Array.from(dropdown.querySelectorAll('li[role="option"]'));
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      active = (active + 1) % items.length;
      updateActive(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      active = (active - 1 + items.length) % items.length;
      updateActive(items);
    } else if (e.key === 'Enter') {
      if (active >= 0 && items[active]) {
        e.preventDefault();
        const link = items[active].querySelector('a');
        link?.click();
        hideDropdown();
      }
    } else if (e.key === 'Escape') {
      hideDropdown();
      input.blur();
    }
  });

  function updateActive(items) {
    items.forEach((li, i) => li.classList.toggle('is-active', i === active));
    items[active]?.scrollIntoView({ block: 'nearest' });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search, .search-pill')) hideDropdown();
  });
})();
