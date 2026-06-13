const PRODUCTS = [
  { id: 1,  name: "Wireless Headphones", emoji: "🎧", price: 49.99 },
  { id: 2,  name: "Mechanical Keyboard", emoji: "⌨️", price: 89.99 },
  { id: 3,  name: "USB-C Hub",           emoji: "🔌", price: 29.99 },
  { id: 4,  name: "Laptop Stand",        emoji: "💻", price: 34.99 },
  { id: 5,  name: "Webcam HD",           emoji: "📷", price: 59.99 },
  { id: 6,  name: "Desk Lamp",           emoji: "💡", price: 24.99 },
  { id: 7,  name: "Notebook",            emoji: "📓", price: 9.99  },
  { id: 8,  name: "Coffee Mug",          emoji: "☕", price: 14.99 },
];

/* ── State ── */
const cart = {}; // { [productId]: quantity }

/* ── DOM refs ── */
const productGrid  = document.getElementById("product-grid");
const cartBtn      = document.getElementById("cart-btn");
const cartPanel    = document.getElementById("cart-panel");
const cartCount    = document.getElementById("cart-count");
const cartItems    = document.getElementById("cart-items");
const cartEmpty    = document.getElementById("cart-empty");
const cartTotal    = document.getElementById("cart-total");
const checkoutBtn  = document.getElementById("checkout-btn");
const toast        = document.getElementById("toast");

/* ── Render products ── */
function renderProducts() {
  productGrid.innerHTML = "";
  PRODUCTS.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="emoji">${p.emoji}</div>
      <h3>${p.name}</h3>
      <div class="price">$${p.price.toFixed(2)}</div>
      <button data-id="${p.id}">Add to Cart</button>
    `;
    card.querySelector("button").addEventListener("click", () => addToCart(p.id));
    productGrid.appendChild(card);
  });
}

/* ── Cart helpers ── */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCart();
  const product = PRODUCTS.find((p) => p.id === id);
  showToast(`${product.emoji} ${product.name} added!`);
}

function removeFromCart(id) {
  delete cart[id];
  updateCart();
}

function updateCart() {
  const ids = Object.keys(cart).map(Number);
  const totalItems = ids.reduce((sum, id) => sum + cart[id], 0);
  cartCount.textContent = totalItems;

  cartItems.innerHTML = "";
  ids.forEach((id) => {
    const product = PRODUCTS.find((p) => p.id === id);
    const qty     = cart[id];
    const li      = document.createElement("li");
    li.innerHTML  = `
      <span class="item-name">${product.emoji} ${product.name}${qty > 1 ? ` ×${qty}` : ""}</span>
      <span class="item-price">$${(product.price * qty).toFixed(2)}</span>
      <button aria-label="Remove ${product.name}" data-id="${id}">✕</button>
    `;
    li.querySelector("button").addEventListener("click", () => removeFromCart(id));
    cartItems.appendChild(li);
  });

  const total = ids.reduce((sum, id) => sum + PRODUCTS.find((p) => p.id === id).price * cart[id], 0);
  cartTotal.textContent = total.toFixed(2);

  cartEmpty.style.display = ids.length === 0 ? "block" : "none";
  cartItems.style.display  = ids.length === 0 ? "none"  : "flex";
}

/* ── Toggle cart panel ── */
cartBtn.addEventListener("click", () => {
  const isHidden = cartPanel.hasAttribute("hidden");
  if (isHidden) {
    cartPanel.removeAttribute("hidden");
  } else {
    cartPanel.setAttribute("hidden", "");
  }
});

/* ── Checkout ── */
checkoutBtn.addEventListener("click", () => {
  if (Object.keys(cart).length === 0) return;
  Object.keys(cart).forEach((id) => delete cart[id]);
  updateCart();
  showToast("✅ Order placed – thank you!");
});

/* ── Toast ── */
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ── Init ── */
renderProducts();
updateCart();
