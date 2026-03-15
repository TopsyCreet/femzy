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
  'Mentality Tracksuit':  { price: 50000,  category: 'Tracksuits', gradient: 'linear-gradient(145deg,#1a1a2e,#0f3460,#16213e)', icon: '⌘' },
  'Mentality Tanktop':    { price: 20000,  category: 'Tanktops',   gradient: 'linear-gradient(145deg,#2d1b00,#533300,#1a0d00)', icon: '◈' },
  'Mentality Baseball Cap': { price: 25000, category: 'Caps', gradient: 'linear-gradient(145deg,#0d1f35,#1a3a5c,#0a1628)', icon: '◉' },
  'Alpha Cap — Midnight': { price: 65000,  category: 'Caps',       gradient: 'linear-gradient(145deg,#1a1a1a,#333,#0d0d0d)',    icon: '◎' },
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

function addToCart(productName) {
  const p = PRODUCTS[productName];
  if (!p) return;
  const existing = cart.find(i => i.name === productName);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name: productName, price: p.price, category: p.category, qty: 1, gradient: p.gradient, icon: p.icon });
  }
  updateCartBadge();
  renderCart();
  showToast(`✓ ${productName} added`);
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
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
      <div class="cart-item-img" style="background:${item.gradient}">
        <span style="font-size:2.2rem;opacity:0.18;color:var(--gold)">${item.icon}</span>
      </div>
      <div class="cart-item-details">
        <p class="cart-item-brand">Alpha Wears</p>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-meta">${item.category} &nbsp;·&nbsp; One Size</p>
        <div class="cart-item-controls">
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">Remove</button>
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
document.getElementById('btnNavCart')?.addEventListener('click', openCart);

/* ── Add-to-Cart buttons (product cards) ── */
const productNames = [
  'Mentality Tracksuit',
  'Mentality Tanktop',
  'Mentality Baseball Cap',
  'Alpha Cap — Midnight',
];

document.querySelectorAll('.btn-add-cart').forEach((btn, i) => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const name = productNames[i] || 'Alpha Oversized Tee';
    addToCart(name);
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
  const lines = cart.map(i => `• ${i.name} (x${i.qty}) — ₦${(i.price * i.qty).toLocaleString()}`).join('\n');
  const total = getCartTotal().toLocaleString();
  const msg   = `Hello Alpha Wears! 👋\n\nI'd like to place an order:\n\n${lines}\n\n*Total: ₦${total}*\n\nPlease confirm availability and shipping details. Thank you!`;
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