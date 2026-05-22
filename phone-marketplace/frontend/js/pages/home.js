import productCard
from '../components/productCard.js';

import {
  getProducts
} from '../api/productApi.js';

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

  document.getElementById(
    'cart-count'
  ).innerText = cart.length;

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

    console.error(err);

  }

}

function renderProducts(
products
) {

  document.getElementById(
    'products'
  ).innerHTML = products
    .map(product =>
      productCard(product)
    )
    .join('');

  document.getElementById(
    'flash-sale'
  ).innerHTML = products
    .slice(0, 4)
    .map(product =>
      productCard(product)
    )
    .join('');

}

function setupSearch() {

  const input =
    document.querySelector(
      '.search-box input'
    );

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
            .toLowerCase()
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

async function init() {

  await loadProducts();

  setupSearch();

  setupCategory();

  updateCartCount();

}

init();
