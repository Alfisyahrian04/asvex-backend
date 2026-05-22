import productCard
from '../components/productCard.js';

import {
  getProducts
} from '../api/productApi.js';

const currentUser =
JSON.parse(
  localStorage.getItem(
    'user'
  )
);

let allProducts = [];

let cart =
JSON.parse(
  localStorage.getItem(
    'cart'
  )
) || [];

window.addToCart =
function(product) {

  cart.push(product);

  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );

  updateCartCount();

  showToast(
    'Produk masuk keranjang'
  );

};

function updateCartCount() {

  const cartCount =
    document.getElementById(
      'cart-count'
    );

  if (cartCount) {

    cartCount.innerText =
      cart.length;

  }

}

function showToast(message) {

  const toast =
    document.createElement(
      'div'
    );

  toast.className =
    'toast';

  toast.innerText =
    message;

  document.body.appendChild(
    toast
  );

  setTimeout(() => {

    toast.remove();

  }, 2000);

}

async function loadProducts() {

  try {

    allProducts =
      await getProducts();

    renderProducts(
      allProducts
    );

  } catch (err) {

    console.error(
      'LOAD PRODUCT ERROR:',
      err
    );

  }

}

function renderProducts(
products
) {

  const productsEl =
    document.getElementById(
      'products'
    );

  const flashSaleEl =
    document.getElementById(
      'flash-sale'
    );

  if (productsEl) {

    productsEl.innerHTML =
      products
      .map(product =>
        productCard(product)
      )
      .join('');

  }

  if (flashSaleEl) {

    flashSaleEl.innerHTML =
      products
      .slice(0, 4)
      .map(product =>
        productCard(product)
      )
      .join('');

  }

}

function setupSearch() {

  const input =
    document.querySelector(
      '.search-box input'
    );

  if (!input) return;

  input.addEventListener(
    'input',
    (e) => {

      const keyword =
        e.target.value
        .toLowerCase();

      const filtered =
        allProducts.filter(
          product =>

            product.name
            ?.toLowerCase()
            .includes(keyword)

        );

      renderProducts(
        filtered
      );

    }
  );

}

function setupCategory() {

  const categories =
    document.querySelectorAll(
      '.category'
    );

  categories.forEach(
    category => {

      category.addEventListener(
        'click',
        () => {

          const text =
            category.innerText
            .toLowerCase();

          const filtered =
            allProducts.filter(
              product =>

                product.category
                ?.toLowerCase()
                .includes(text)

            );

          renderProducts(
            filtered
          );

        }
      );

    }
  );

}

function setupProfile() {

  const logo =
    document.querySelector(
      '.logo'
    );

  if (
    currentUser &&
    logo
  ) {

    logo.innerHTML = `
      Hi,
      ${currentUser.name}
    `;

  }

}

function setupBottomNav() {

  const navItems =
    document.querySelectorAll(
      '.bottom-nav div'
    );

  navItems.forEach(
    item => {

      item.addEventListener(
        'click',
        () => {

          const text =
            item.innerText
            .toLowerCase();

          if (
            text.includes(
              'profile'
            )
          ) {

            window.location.href =
              './profile.html';

          }

          if (
            text.includes(
              'cart'
            )
          ) {

            window.location.href =
              './cart.html';

          }

          if (
            text.includes(
              'home'
            )
          ) {

            window.location.href =
              './index.html';

          }

        }
      );

    }
  );

}

async function init() {

  setupProfile();

  await loadProducts();

  setupSearch();

  setupCategory();

  setupBottomNav();

  updateCartCount();

}

init();
