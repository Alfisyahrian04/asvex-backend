protectPage();

const productContainer = document.getElementById('product-list');
const recommendationContainer = document.getElementById('recommendation-list');
const trendingSection = document.querySelector('.trending-section');
const cartCount = document.getElementById('cart-count');

const token = localStorage.getItem('token');
const currentUser =
JSON.parse(localStorage.getItem('currentUser')) ||
JSON.parse(localStorage.getItem('user')) ||
null;

let allProducts = [];
let selectedCategory = 'Semua';

document.getElementById('search-bar').innerHTML = renderSearchBar();

const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const categoryList = document.querySelector('.category-list');

function renderUsername() {
  const usernameEl = document.getElementById('username');
  if (!usernameEl) return;

  usernameEl.innerText =
    currentUser?.username ||
    currentUser?.name ||
    'User';
}

async function loadProducts() {
  try {
    const products = await fetchProducts();

    allProducts = products || [];

    productStore.setProducts(allProducts);

    renderDynamicCategories(allProducts);
    renderProducts(allProducts);
    loadRecommendations();

  } catch (error) {
    console.log(error);

    productContainer.innerHTML = `
      <div class="empty-product">
        Belum ada produk
      </div>
    `;
  }
}

function renderDynamicCategories(products) {
  if (!categoryList) return;

  const categories = [
    'Semua',
    ...new Set(
      products
        .map(item => item.category?.trim())
        .filter(Boolean)
    )
  ];

  categoryList.innerHTML =
    categories
      .map(category => `
        <button
          class="category ${category === selectedCategory ? 'active' : ''}"
          data-category="${category}"
        >
          ${category}
        </button>
      `)
      .join('');

  document
    .querySelectorAll('.category')
    .forEach(button => {
      button.addEventListener('click', () => {
        selectedCategory =
          button.dataset.category;

        document
          .querySelectorAll('.category')
          .forEach(btn =>
            btn.classList.remove('active')
          );

        button.classList.add('active');

        filterProducts();
      });
    });
}

async function loadRecommendations() {
  try {

    const grouped = {};

    allProducts.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }

      grouped[product.category].push(product);
    });

    const recommendationProducts = [];

    Object.values(grouped).forEach(items => {
      const cheapest =
        [...items]
        .sort((a,b) => a.price - b.price)[0];

      if (cheapest) {
        recommendationProducts.push(cheapest);
      }
    });

    renderRecommendations(
      recommendationProducts.slice(0, 3)
    );

  } catch(error) {
    console.log(error);
  }
}

function renderRecommendations(products) {
  if (!recommendationContainer) return;

  recommendationContainer.innerHTML =
    products.map(product =>
      renderProductCard(product)
    ).join('');
}

function renderProducts(products) {
  if (!products.length) {
    productContainer.innerHTML = `
      <div class="empty-product">
        Produk kosong
      </div>
    `;
    return;
  }

  productContainer.innerHTML =
    products
      .map(product => renderProductCard(product))
      .join('');
}

function filterProducts() {
  let filtered = [...allProducts];

  const keyword =
    searchInput?.value?.toLowerCase() || '';

  const sort =
    sortSelect?.value || '';

  if (selectedCategory !== 'Semua') {
    filtered = filtered.filter(
      item =>
        item.category?.toLowerCase() ===
        selectedCategory.toLowerCase()
    );
  }

  if (keyword) {
    filtered = filtered.filter(
      item =>
        item.name?.toLowerCase().includes(keyword)
    );
  }

  if (sort === 'lowest') {
    filtered.sort((a,b)=>a.price-b.price);
  }

  if (sort === 'highest') {
    filtered.sort((a,b)=>b.price-a.price);
  }

  renderProducts(filtered);
}

window.addToCart = function(product) {
  cartStore.addToCart(product);
  updateCartCount();
  alert('Produk ditambahkan');
};

function updateCartCount() {
  if(cartCount){
    cartCount.innerText =
      cartStore.getCartCount();
  }
}

if (trendingSection) {
  trendingSection.style.display = 'none';
}

searchInput?.addEventListener(
  'input',
  filterProducts
);

sortSelect?.addEventListener(
  'change',
  filterProducts
);

renderUsername();
updateCartCount();
loadProducts();
