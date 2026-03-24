/* ═══════════════════════════════════════════════════
   ALPHA WEARS — main.js
   All interactivity: cursor, nav, cart, WhatsApp,
   contact modal, scroll reveal, animations
   © 2025 Alpha Wears
═══════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

/* ══════════════════════════════════════
   NAVBAR — scroll behaviour
══════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════
   HERO IMAGE SLIDER — autoplay
══════════════════════════════════════ */
(function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.slide)));
  });

  // Autoplay every 5s
  setInterval(() => goTo(current + 1), 5000);
})();

/* ══════════════════════════════════════
   TICKER — duplicate for seamless loop
══════════════════════════════════════ */
const tickerInner = document.getElementById('ticker');
if (tickerInner) tickerInner.innerHTML += tickerInner.innerHTML;

/* ══════════════════════════════════════
   SMOOTH ANCHOR SCROLL
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

/* ══════════════════════════════════════
   PARALLAX HERO
══════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && y < window.innerHeight) {
    heroContent.style.transform = `translateY(${y * 0.25}px)`;
    heroContent.style.opacity   = String(1 - (y / window.innerHeight) * 1.4);
  }
});

/* ══════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════ */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

/* ══════════════════════════════════════
   CART SYSTEM
══════════════════════════════════════ */
const WA_NUMBER = '2349098641755';

/** Product catalogue — must match the cards in index.html */
const PRODUCTS = {
  'Mentality Tracksuit':      { price: 80000,  category: 'Tracksuits', gradient: 'linear-gradient(145deg,#1a1a2e,#0f3460,#16213e)', icon: '⌘' },
  'Mentality Tanktop':        { price: 30000,  category: 'Tanktops',   gradient: 'linear-gradient(145deg,#2d1b00,#533300,#1a0d00)', icon: '◈' },
  'Mentality Baseball Cap':   { price: 25000,  category: 'Caps',       gradient: 'linear-gradient(145deg,#0d1f35,#1a3a5c,#0a1628)', icon: '◉' },
  'Mentality Snapback':       { price: 20000,  category: 'Caps',       gradient: 'linear-gradient(145deg,#1a1a1a,#333,#0d0d0d)',    icon: '◎' },
  'ALPHA SS SHIRT':           { price: 50000,  category: 'Shirts',     gradient: 'linear-gradient(145deg,#1a1a1a,#333,#0d0d0d)',    icon: '◈' },
  'Alpha Head Gear':          { price: 15000,  category: 'Headwear',   gradient: 'linear-gradient(145deg,#1a1a1a,#333,#0d0d0d)',    icon: '◉' },
  'Alpha SS Pant':            { price: 45000,  category: 'Pants',      gradient: 'linear-gradient(145deg,#1a1a2e,#0f3460,#16213e)', icon: '◎' },
  'Mentality Stripped Pant':  { price: 60000,  category: 'Pants',      gradient: 'linear-gradient(145deg,#2d1b00,#533300,#1a0d00)', icon: '⌘' },
  'Alpha Prime Lifestyle Hoodie': { price: 70000, category: 'Hoodies', gradient: 'linear-gradient(145deg,#1a1a2e,#3a1a5c,#0a0a1e)', icon: '◈' },
  'Alpha Prime Lifestyle Shorts': { price: 25000, category: 'Shorts',  gradient: 'linear-gradient(145deg,#1a1a1a,#444,#0d0d0d)',    icon: '◎' },
  'Alpha Flex Shirt':         { price: 40000,  category: 'Shirts',     gradient: 'linear-gradient(145deg,#1a2e1a,#0f4020,#0a1e0a)', icon: '◈' },
  'Alpha Flex Cargo Pant':    { price: 35000,  category: 'Pants',      gradient: 'linear-gradient(145deg,#2e2a1a,#3a3010,#1e1a0a)', icon: '◎' },
  'Alpha Leather Luxe Fit':   { price: 80000,  category: 'Jackets',    gradient: 'linear-gradient(145deg,#1a1a1a,#2a2a2a,#0d0d0d)', icon: '⌘' },
};

/** @type {{ name: string, price: number, category: string, qty: number, gradient: string, icon: string }[]} */
let cart = [];

function getCartCount() { return cart.reduce((s, i) => s + i.qty, 0); }
function getCartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

function updateCartBadge() {
  const n      = getCartCount();
  const badge  = document.querySelector('.cart-count');
  const drawer = document.getElementById('cartBadgeDrawer');
  if (badge)  badge.textContent  = n;
  if (drawer) drawer.textContent = n === 0 ? '0 items' : `${n} item${n !== 1 ? 's' : ''}`;
}

function addToCart(productName, color, imgSrc) {
  const p = PRODUCTS[productName];
  if (!p) return;
  const selectedColor = color || 'Not specified';
  const existing = cart.find(i => i.name === productName && i.color === selectedColor);
  if (existing) {
    existing.qty++;
    if (imgSrc) existing.imgSrc = imgSrc;
  } else {
    cart.push({ name: productName, price: p.price, category: p.category, qty: 1, gradient: p.gradient, icon: p.icon, color: selectedColor, size: '', imgSrc: imgSrc || '' });
  }
  updateCartBadge();
  renderCart();
  showToast(`✓ ${productName} added`);
}

function removeFromCart(name, color) {
  cart = cart.filter(i => !(i.name === name && i.color === (color || i.color)));
  updateCartBadge();
  renderCart();
}

function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  updateCartBadge();
  renderCart();
}

function changeSize(name, color, val) {
  const item = cart.find(i => i.name === name && i.color === color);
  if (item) item.size = val;
}
window.changeSize = changeSize;

// Expose to global scope so inline onclick attributes in rendered HTML can call them
window.removeFromCart = removeFromCart;
window.changeQty      = changeQty;
window.closeCart      = closeCart;

function renderCart() {
  const container = document.getElementById('cartItemsContainer');
  const footer    = document.getElementById('cartFooter');
  if (!container || !footer) return;

  if (cart.length === 0) {
    footer.style.display = 'none';
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">◎</div>
        <h3>Your cart is empty</h3>
        <p>Discover our latest drops and add your favourites to the cart.</p>
        <a href="#new-arrivals" class="btn-primary" onclick="closeCart()">Shop Collection</a>
      </div>`;
    return;
  }

  footer.style.display = 'block';
  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-name="${item.name}">
      <div class="cart-item-img">
        ${item.imgSrc
          ? `<img src="${item.imgSrc}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"/>`
          : `<div style="width:100%;height:100%;background:${item.gradient};display:flex;align-items:center;justify-content:center;"><span style="font-size:2rem;opacity:0.18;color:var(--gold)">${item.icon}</span></div>`
        }
      </div>
      <div class="cart-item-details">
        <p class="cart-item-brand">Alpha Wears</p>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-meta">${item.category} &nbsp;·&nbsp; <span style="color:var(--gold)">Color: ${item.color}</span></p>
        <div class="cart-size-row">
          <label class="cart-size-label">Size:</label>
          <select class="cart-size-select" onchange="changeSize('${item.name}','${item.color}',this.value)">
            <option value="" ${!item.size ? 'selected' : ''}>Select size</option>
            <option value="XS" ${item.size==='XS'?'selected':''}>XS</option>
            <option value="S" ${item.size==='S'?'selected':''}>S</option>
            <option value="M" ${item.size==='M'?'selected':''}>M</option>
            <option value="L" ${item.size==='L'?'selected':''}>L</option>
            <option value="XL" ${item.size==='XL'?'selected':''}>XL</option>
            <option value="XXL" ${item.size==='XXL'?'selected':''}>XXL</option>
          </select>
        </div>
        <div class="cart-item-controls">
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.name}','${item.color}')">Remove</button>
          <span class="cart-item-price">₦${(item.price * item.qty).toLocaleString()}</span>
        </div>
      </div>
    </div>`).join('');

  const subtotalEl = document.getElementById('cartSubtotal');
  if (subtotalEl) subtotalEl.textContent = `₦${getCartTotal().toLocaleString()}`;
}

/* ── Open / Close Cart ── */
function openCart() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartClose')?.addEventListener('click', closeCart);
document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
document.getElementById('btnContinue')?.addEventListener('click', closeCart);

/* ── Jacket Carousel ── */
(function() {
  const track = document.getElementById('jacketTrack');
  const dots  = document.querySelectorAll('.jacket-dot');
  if (!track) return;
  let cur = 0;
  const total = 3;

  function goTo(n) {
    cur = (n + total) % total;
    track.style.transform = `translateX(-${cur * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === cur));
  }

  document.getElementById('jacketPrev')?.addEventListener('click', () => goTo(cur - 1));
  document.getElementById('jacketNext')?.addEventListener('click', () => goTo(cur + 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.idx)));

  // Touch/swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? cur + 1 : cur - 1);
  });

  // Add jacket to cart
  document.getElementById('btnAddJacket')?.addEventListener('click', () => {
    const colors = ['Black', 'Red', 'Yellow'];
    const imgs   = ['images/jacket/jacket_black.jpeg','images/jacket/jacket_red.jpeg','images/jacket/jacket_yellow.jpeg'];
    addToCart('Alpha Leather Luxe Fit', colors[cur], window.location.origin + '/' + imgs[cur]);
    const btn = document.getElementById('btnAddJacket');
    btn.textContent = '✓ Added';
    btn.style.background = 'var(--gold)';
    setTimeout(() => { btn.textContent = 'ADD TO CART'; btn.style.background = ''; }, 1800);
  });
})();
document.getElementById('btnNavCart')?.addEventListener('click', openCart);

/* ── Add-to-Cart buttons (product cards) ── */
document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card = btn.closest('.product-card') || btn.closest('.look-prod-card');
    if (!card) return;
    const nameEl = card.querySelector('.product-name') || card.querySelector('.look-prod-name');
    const name   = nameEl ? nameEl.textContent.trim() : '';
    const activeSwatch = card.querySelector('.swatch.active');
    const color  = activeSwatch ? activeSwatch.title : 'Default';
    const img    = card.querySelector('.prod-color-img');
    const imgSrc = img ? img.src : '';
    addToCart(name, color, imgSrc);
    btn.textContent        = '✓ Added';
    btn.style.background   = 'var(--gold)';
    btn.style.color        = 'var(--black)';
    setTimeout(() => {
      btn.textContent      = 'Add to Cart';
      btn.style.background = '';
      btn.style.color      = '';
    }, 1800);
  });
});

/* ══════════════════════════════════════
   WHATSAPP CHECKOUT
══════════════════════════════════════ */
document.getElementById('btnWhatsappCheckout')?.addEventListener('click', () => {
  if (cart.length === 0) return;
  const missing = cart.find(i => !i.size);
  if (missing) { showToast('Please select a size for all items'); return; }
  const lines = cart.map(i => `• ${i.name}\n  Color: ${i.color} | Size: ${i.size} | Qty: ${i.qty} | ₦${(i.price * i.qty).toLocaleString()}`).join('\n\n');
  const total = getCartTotal().toLocaleString();
  const msg   = `Hello Alpha Wears! 👋\n\nI'd like to place an order:\n\n${lines}\n\n*Total: ₦${total}*\n\nPlease confirm availability and share shipping details. Thank you!`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
});

/* ══════════════════════════════════════
   WHATSAPP FLOAT BUTTON → open contact modal
══════════════════════════════════════ */
document.getElementById('waFloatBtn')?.addEventListener('click', () => {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
});

/* ══════════════════════════════════════
   CONTACT MODAL
══════════════════════════════════════ */
function closeModal() {
  document.getElementById('contactModal')?.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modalClose')?.addEventListener('click', closeModal);

document.getElementById('contactModal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('contactModal')) closeModal();
});

document.getElementById('btnSendMsg')?.addEventListener('click', () => {
  const nameEl    = document.getElementById('contactName');
  const msgEl     = document.getElementById('contactMessage');
  const name      = nameEl ? nameEl.value.trim() : '';
  const message   = msgEl  ? msgEl.value.trim()  : '';

  if (!message) { showToast('Please enter a message first'); return; }

  const greeting = name ? `Hi, I'm ${name}. ` : '';
  const full     = `Hello Alpha Wears! 👋\n\n${greeting}${message}`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(full)}`, '_blank');

  closeModal();
  if (nameEl) nameEl.value = '';
  if (msgEl)  msgEl.value  = '';
});

/* ══════════════════════════════════════
   KEYBOARD SHORTCUTS
══════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeCart(); closeModal(); }
});

/* ══════════════════════════════════════
   COLOR SWATCHES — tracksuit image switcher
══════════════════════════════════════ */
document.querySelectorAll('.swatch').forEach(btn => {
  btn.addEventListener('click', function () {
    const target = document.getElementById(this.dataset.target);
    if (target) target.src = this.dataset.img;
    document.querySelectorAll(`.swatch[data-target="${this.dataset.target}"]`)
      .forEach(s => s.classList.remove('active'));
    this.classList.add('active');
  });
});

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
renderCart();
updateCartBadge();