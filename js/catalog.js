const INSTAGRAM_URL = 'https://www.instagram.com/hannybiis?igsh=OWo5anFoZWpwN2Fp';
const STORAGE_KEY = 'reservebar_products';
const DATA_PATH = 'data/products.json';

function shareToInstagram(product) {
  const text = encodeURIComponent(
    `${product.name} – ${product.currency}${product.price}\n\n${product.description}\n\nDM us on Instagram to order!`
  );
  const url = `https://www.instagram.com/direct/new/?text=${text}`;
  window.open(url, '_blank', 'noopener');
}

function buildProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-image-wrap">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
    </div>
    <div class="product-info">
      <h2 class="product-name">${escapeHtml(product.name)}</h2>
      <p class="product-description">${escapeHtml(product.description)}</p>
      <p class="product-price">${escapeHtml(product.currency || '$')}${escapeHtml(String(product.price))}</p>
      <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener" class="share-instagram" data-product-id="${escapeHtml(product.id)}">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/></svg>
        Share / Order on Instagram
      </a>
    </div>
  `;
  const shareBtn = card.querySelector('.share-instagram');
  shareBtn.addEventListener('click', function (e) {
    e.preventDefault();
    shareToInstagram(product);
  });
  return card;
}

function escapeHtml(str) {
  if (str == null) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadCatalog() {
  const el = document.getElementById('catalog');
  let loading = document.getElementById('loading');
  if (!loading) {
    loading = document.createElement('div');
    loading.className = 'loading';
    loading.id = 'loading';
    loading.textContent = 'Loading catalog…';
    el.innerHTML = '';
    el.appendChild(loading);
  }

  try {
    let products = [];

    // Use products from localStorage if admin has added/edited (same key as admin)
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (fromStorage) {
      try {
        const parsed = JSON.parse(fromStorage);
        if (Array.isArray(parsed) && parsed.length) products = parsed;
      } catch (_) {}
    }

    // Otherwise load from products.json and save to localStorage so it persists forever (survives tab close)
    if (!products.length) {
      try {
        const res = await fetch(DATA_PATH);
        if (res.ok) products = await res.json();
        if (!Array.isArray(products)) products = [];
        if (products.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } catch (_) {}
    }

    loading.remove();
    if (!products.length) {
      el.innerHTML = '<p class="empty-catalog">No products yet. Check back soon or follow us on Instagram.</p>';
      return;
    }
    el.replaceChildren(...products.map(buildProductCard));
  } catch (err) {
    loading.textContent = 'Could not load catalog. Refresh or check connection.';
  }
}

loadCatalog();
setInterval(loadCatalog, 5000);
