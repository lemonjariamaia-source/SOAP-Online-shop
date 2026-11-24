
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

let cart = JSON.parse(localStorage.getItem("pureglow-cart") || "[]");

function saveCart() {
  localStorage.setItem("pureglow-cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = document.getElementById("cart-count");
  if (count) count.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderProducts(items = products) {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  grid.innerHTML = items.map(item => {
    const index = products.indexOf(item);
    return `
      <article class="product-card fade-in">
        <a href="product.html?id=${index}">
          <img src="${photo(index)}" alt="${item[0]}" loading="lazy">
        </a>
        <div class="product-info">
          <p>${item[2]}</p>
          <h3>${item[0]}</h3>
          <p>${item[3]}</p>
          <div class="price">$${item[1].toFixed(2)}</div>
          <button class="btn" onclick="addToCart(${index})">
            Add to cart
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function addToCart(index) {
  const product = products[index];
  if (!product) return;

  const existing = cart.find(item => item.id === index);

  if (existing) existing.qty++;
  else cart.push({ id: index, qty: 1 });

  saveCart();
  renderCart();
  openCart();
}

function renderCart() {
  const list = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");
  if (!list || !total) return;

  list.innerHTML = cart.length
    ? cart.map(item => `
      <div class="cart-item">
        <div>
          <strong>${products[item.id][0]}</strong>
          <p>$${products[item.id][1]} × ${item.qty}</p>
        </div>
        <button onclick="removeItem(${item.id})">Remove</button>
      </div>
    `).join("")
    : "<p>Your basket is empty.</p>";

  total.textContent = "$" + cart.reduce(
    (sum, item) => sum + products[item.id][1] * item.qty, 0
  ).toFixed(2);
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

function openLogin() {
  document.getElementById("login-modal")?.classList.add("open");
}

function closeLogin() {
  document.getElementById("login-modal")?.classList.remove("open");
}

function searchProducts() {
  const query = document.getElementById("search")?.value.toLowerCase() || "";
  const category = document.getElementById("category")?.value || "All";

  const filtered = products.filter(item =>
    item[0].toLowerCase().includes(query) &&
    (category === "All" || item[2] === category)
  );

  renderProducts(filtered);
}

function showProduct() {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const id = Number(new URLSearchParams(location.search).get("id"));
  const item = products[id];

  if (!item) {
    container.innerHTML = "<h2>Product not found</h2>";
    return;
  }

  container.innerHTML = `
    <div class="story">
      <img src="${photo(id)}" alt="${item[0]}">
      <div>
        <p class="eyebrow">${item[2]} collection</p>
        <h1>${item[0]}</h1>
        <h2>$${item[1].toFixed(2)}</h2>
        <p>${item[3]}. Handmade with thoughtfully selected ingredients
        for a gentle everyday cleansing ritual.</p>
        <br>
        <button class="btn" onclick="addToCart(${id})">Add to basket</button>
      </div>
    </div>
  `;
}

function subscribe(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  alert("Thank you! " + email + " has been added to our demo subscription list.");
  event.target.reset();
}

function demoLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  alert("Demo login submitted for " + email + ". Real authentication requires a backend.");
  closeLogin();
}

function checkout() {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }
  alert("Demo checkout: connect a payment provider to accept real payments.");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  updateCartCount();
  showProduct();

  document.getElementById("search")?.addEventListener("input", searchProducts);
  document.getElementById("category")?.addEventListener("change", searchProducts);

  document.getElementById("subscription-form")?.addEventListener("submit", subscribe);
  document.getElementById("login-form")?.addEventListener("submit", demoLogin);
});
