const STORAGE_KEY = 'reservebar_products';
const DATA_PATH = 'data/products.json';

let products = [];

function loadProducts() {
  const fromStorage = localStorage.getItem(STORAGE_KEY);
  if (fromStorage) {
    try {
      products = JSON.parse(fromStorage);
      if (!Array.isArray(products)) products = [];
    } catch (_) {
      products = [];
    }
  }
  if (!products.length) {
    fetch(DATA_PATH)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        products = Array.isArray(data) ? data : [];
        saveProducts();
        renderList();
      })
      .catch(() => renderList());
  } else {
    renderList();
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  renderList();
}

function renderList() {
  const list = document.getElementById('admin-list');
  if (!products.length) {
    list.innerHTML = '<p style="color: var(--text-muted);">No items. Click “Add item” to create one.</p>';
    return;
  }
  list.innerHTML = products
    .map(
      (p) => `
    <div class="admin-card" data-id="${p.id}">
      <img class="thumb" src="${escapeAttr(p.image)}" alt="">
      <div class="details">
        <h3>${escapeHtml(p.name)}</h3>
        <p class="price">${escapeHtml(p.currency || '$')}${escapeHtml(String(p.price))}</p>
        <p style="color: var(--text-muted); font-size: 0.85rem;">${escapeHtml(p.description || '').slice(0, 80)}${(p.description || '').length > 80 ? '…' : ''}</p>
      </div>
      <div class="actions">
        <button type="button" class="btn btn-gold btn-sm btn-edit">Edit</button>
        <button type="button" class="btn btn-ghost btn-sm btn-delete">Delete</button>
      </div>
    </div>
  `
    )
    .join('');

  list.querySelectorAll('.btn-edit').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.admin-card');
      const id = card.getAttribute('data-id');
      openModal(products.find((p) => p.id === id));
    });
  });
  list.querySelectorAll('.btn-delete').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.admin-card');
      const id = card.getAttribute('data-id');
      if (confirm('Remove this item?')) {
        products = products.filter((p) => p.id !== id);
        saveProducts();
      }
    });
  });
}

function escapeHtml(str) {
  if (str == null) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function nextId() {
  const ids = products.map((p) => parseInt(p.id, 10)).filter((n) => !isNaN(n));
  return String(ids.length ? Math.max(...ids) + 1 : 1);
}

const modal = document.getElementById('modal-overlay');
const form = document.getElementById('product-form');
const modalTitle = document.getElementById('modal-title');

const productPhotoInput = document.getElementById('product-photo');

function openModal(product) {
  if (product) {
    modalTitle.textContent = 'Edit item';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name || '';
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-price').value = product.price != null ? product.price : '';
    document.getElementById('product-currency').value = product.currency || '$';
    document.getElementById('product-image').value = product.image || '';
  } else {
    modalTitle.textContent = 'Add item';
    document.getElementById('product-id').value = '';
    form.reset();
    document.getElementById('product-currency').value = '$';
  }
  if (productPhotoInput) {
    productPhotoInput.value = '';
  }
  modal.classList.add('open');
}

function closeModal() {
  modal.classList.remove('open');
}

function submitProduct() {
  const id = document.getElementById('product-id').value;
  const name = document.getElementById('product-name').value.trim();
  const description = document.getElementById('product-description').value.trim();
  const price = document.getElementById('product-price').value.trim();
  const currency = (document.getElementById('product-currency').value || '$').trim();
  const image = document.getElementById('product-image').value.trim();
  if (!name || !description || !price || !image) return;

  const payload = { id: id || nextId(), name, description, price, currency: currency || '$', image };
  const index = products.findIndex((p) => p.id === payload.id);
  if (index >= 0) products[index] = payload;
  else products.push(payload);
  saveProducts();
  closeModal();
}

// When admin uploads a photo file, use it as the image (data URL)
if (productPhotoInput) {
  productPhotoInput.addEventListener('change', () => {
    const file = productPhotoInput.files && productPhotoInput.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById('product-image').value = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

document.getElementById('btn-add').addEventListener('click', () => openModal(null));
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-cancel').addEventListener('click', closeModal);
document.getElementById('modal-save').addEventListener('click', submitProduct);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.getElementById('btn-download').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'products.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

loadProducts();
