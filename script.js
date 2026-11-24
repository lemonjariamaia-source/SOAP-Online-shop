
// ===================================
// PUREGLOW PRODUCT DATABASE
// ===================================

const products = [
  ["Olive Garden Soap", 8, "Natural", "Olive oil and herbs"],
  ["Lavender Dreams", 9, "Floral", "Relaxing lavender"],
  ["Honey Oat Bar", 7, "Natural", "Honey and oatmeal"],
  ["Rose Petal Soap", 10, "Floral", "Rose and shea butter"],
  ["Charcoal Detox", 9, "Special", "Activated charcoal"],
  ["Coconut Milk Bar", 8, "Natural", "Creamy coconut"],
  ["Mint Fresh Soap", 7, "Fresh", "Peppermint and mint"],
  ["Vanilla Cloud", 9, "Sweet", "Warm vanilla scent"],
  ["Lemon Zest", 7, "Fresh", "Fresh lemon oils"],
  ["Shea Butter Bar", 11, "Natural", "Rich shea butter"],
  ["Aloe Vera Calm", 8, "Natural", "Aloe vera extract"],
  ["Rosemary Forest", 9, "Fresh", "Rosemary and sage"],
  ["Coffee Scrub", 10, "Special", "Coffee exfoliating bar"],
  ["Jasmine Bloom", 10, "Floral", "Jasmine fragrance"],
  ["Tea Tree Cleanse", 9, "Special", "Tea tree essential oil"],
  ["Cocoa Butter Soap", 11, "Sweet", "Cocoa and shea butter"],
  ["Eucalyptus Spa", 10, "Fresh", "Eucalyptus aroma"],
  ["Chamomile Soft", 9, "Floral", "Gentle chamomile"]
];

// ===================================
// PRODUCT IMAGES
// ===================================

const pictures = [
  "photo-1600857544200-b2f666a9a2ec",
  "photo-1600428853876-fb5a850b444f",
  "photo-1601049541289-9b1b7bbbfe19",
  "photo-1608248543803-ba4f8c70ae0b",
  "photo-1608571423902-eed4a5ad8108",
  "photo-1608248543803-ba4f8c70ae0b"
];

function photo(index) {
  return `https://images.unsplash.com/${pictures[index % pictures.length]}?auto=format&fit=crop&w=600&q=80`;
}

// ===================================
// SHOPPING CART
// ===================================

let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("Let's Glow-cart") || "[]");

  if (!Array.isArray(cart)) cart = [];

  cart = cart.filter(item =>
    Number.isInteger(item.id) &&
    products[item.id] &&
    Number.isInteger(item.qty) &&
    item.qty > 0
  );
} catch {
  cart = [];
}

function saveCart() {
  localStorage.setItem("Let's Glow-cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = document.getElementById("cart-count");

  if (count) {
    count.textContent = cart.reduce(
      (sum, item) => sum + item.qty, 0
    );
  }
}

function addToCart(index, quantity = 1) {
  const product = products[index];

  if (!product) return;

  const existing = cart.find(item => item.id === index);

  if (existing) {
    existing.qty += quantity;
  } else {
    cart.push({ id: index, qty: quantity });
  }

  saveCart();
  renderCart();
  openCart();
}

function renderCart() {
  const list = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");

  if (!list || !total) return;

  if (cart.length === 0) {
    list.innerHTML = "<p>Your shopping bag is empty.</p>";
  } else {
    list.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <strong>${products[item.id][0]}</strong>
          <p>$${products[item.id][1]} × ${item.qty}</p>
        </div>
        <button onclick="removeItem(${item.id})">
          Remove
        </button>
      </div>
    `).join("");
  }

  const amount = cart.reduce(
    (sum, item) =>
      sum + products[item.id][1] * item.qty,
    0
  );

  total.textContent = "$" + amount.toFixed(2);
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);

  saveCart();
  renderCart();
}

function openCart() {
  document.getElementById("cart-panel")?.classList.add("open");
}

function closeCart() {
  document.getElementById("cart-panel")?.classList.remove("open");
}

// ===================================
// LOGIN
// ===================================

function openLogin() {
  document.getElementById("login-modal")?.classList.add("open");
}

function closeLogin() {
  document.getElementById("login-modal")?.classList.remove("open");
}

function demoLogin(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;

  alert("Welcome to PureGlow! Demo login submitted for " + email);

  closeLogin();
}

// ===================================
// PRODUCT DISPLAY
// ===================================

function renderProducts(items = products) {
  const grid = document.getElementById("products-grid");

  if (!grid) return;

  if (!items.length) {
    grid.innerHTML = "<p>No products found.</p>";
    return;
  }

  grid.innerHTML = items.map(item => {
    const index = products.indexOf(item);

    return `
      <article class="product-card fade-in">

        <a href="product.html?id=${index}">
          <img src="${photo(index)}"
            alt="${item[0]}" loading="lazy">
        </a>

        <div class="product-info">
          <p>${item[2]}</p>
          <h3>${item[0]}</h3>
          <p>${item[3]}</p>

          <div class="price">
            $${item[1].toFixed(2)}
          </div>

                <button class="btn"
            onclick="addToCart(${index})">
            Add to Cart
          </button>

        </div>
      </article>
    `;
  }).join("");
}

// ===================================
// SEARCH AND FILTER
// ===================================

function searchProducts() {
  const query =
    document.getElementById("search")?.value.toLowerCase() || "";

  const category =
    document.getElementById("category")?.value || "All";

  const filtered = products.filter(item =>
    item[0].toLowerCase().includes(query) &&
    (category === "All" || item[2] === category)
  );

  renderProducts(filtered);
}

// ===================================
// PRODUCT DETAILS PAGE
// ===================================

function showProduct() {
  const container = document.getElementById("product-detail");

  if (!container) return;

  const params = new URLSearchParams(window.location.search);

  const rawId = params.get("id");

  const id = rawId === null ? NaN : Number(rawId);

  if (!Number.isInteger(id) || !products[id]) {
    container.innerHTML = `
      <div class="section-heading">
        <h2>Choose a soap from our collection</h2>
        <p>Please select a product to see its details.</p>
        <br>
        <a href="shop.html" class="btn">Explore Our Shop</a>
      </div>
    `;
    return;
  }

  const item = products[id];

  container.innerHTML = `
    <div class="story fade-in">

      <div>
        <img
          src="${photo(id)}"
          alt="${item[0]}"
          style="width:100%;height:480px;object-fit:cover"
        >
      </div>

      <div>

        <span class="eyebrow">
          PUREGLOW NATURAL COLLECTION
        </span>

        <h1 style="font-size:42px;margin:15px 0">
          ${item[0]}
        </h1>

        <p>★★★★★</p>

        <h2 style="margin:20px 0">
          $${item[1].toFixed(2)}
        </h2>

        <p>${item[3]}.</p>

        <br>

        <p>
          Enjoy a beautiful everyday skincare ritual
          with our botanical-inspired handmade soap.
        </p>

        <br>

        <p><strong>Category:</strong> ${item[2]}</p>
        <p><strong>Size:</strong> 100g</p>

        <br>

        <label for="quantity">Quantity:</label>

        <input
          type="number"
          id="quantity"
          value="1"
          min="1"
          max="20"
          style="width:90px"
        >

        <br><br>

        <button
          class="btn"
          onclick="addSelectedProduct(${id})">
          Add to Shopping Bag
        </button>

      </div>

    </div>
  `;
}

function addSelectedProduct(id) {
  const field = document.getElementById("quantity");

  const quantity = Math.max(
    1,
    Math.min(20, Number(field?.value) || 1)
  );

  addToCart(id, quantity);
}

// ===================================
// RELATED PRODUCTS
// ===================================

function renderRelatedProducts() {
  const container = document.getElementById("related-products");

  if (!container) return;

  const currentId = Number(
    new URLSearchParams(window.location.search).get("id")
  );

  container.innerHTML = products
    .map((item, index) => ({ item, index }))
    .filter(product => product.index !== currentId)
    .slice(0, 4)
    .map(({ item, index }) => `
      <article class="product-card">
        <a href="product.html?id=${index}">
          <img src="${photo(index)}" alt="${item[0]}">
        </a>

        <div class="product-info">
          <h3>${item[0]}</h3>
          <p>${item[2]}</p>
          <div class="price">$${item[1].toFixed(2)}</div>

          <a href="product.html?id=${index}" class="btn">
            View Product
          </a>
        </div>
      </article>
    `).join("");
}

// ===================================
// NEWSLETTER
// ===================================

function subscribe(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;

  alert(
    "Thank you! " + email +
    " has been added to our demo subscription list."
  );

  event.target.reset();
}

// ===================================
// CHECKOUT
// ===================================

function checkout() {
  if (!cart.length) {
    alert("Your shopping bag is empty.");
    return;
  }

  alert(
    "Thank you for shopping with PureGlow! " +
    "This is a demo checkout. Real payments are not enabled."
  );
}

// ===================================
// START WEBSITE
// ===================================

document.addEventListener("DOMContentLoaded", () => {

  renderProducts();

  renderCart();

  updateCartCount();

  showProduct();

  renderRelatedProducts();

  document.getElementById("search")
    ?.addEventListener("input", searchProducts);

  document.getElementById("category")
    ?.addEventListener("change", searchProducts);

  document.getElementById("subscription-form")
    ?.addEventListener("submit", subscribe);

  document.getElementById("login-form")
    ?.addEventListener("submit", demoLogin);

});
