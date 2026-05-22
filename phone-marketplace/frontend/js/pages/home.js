import productCard
from '../components/productCard.js';

import {
  getProducts
} from '../api/productApi.js';

let allProducts = [];

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

          alert(
            item.innerText
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

  setupBottomNav();

}

init();
