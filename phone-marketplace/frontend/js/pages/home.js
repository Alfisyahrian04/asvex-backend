import {
  getProducts
}
from '../api/productApi.js';

const grid =
document.getElementById(
  'productGrid'
);

const flashSale =
document.getElementById(
  'flashSale'
);

async function init() {

  const products =
    await getProducts();

  renderProducts(products);

  renderFlashSale(
    products.slice(0, 5)
  );

}

function renderProducts(
  products
) {

  grid.innerHTML =
    products.map(product => `

      <div class="product-card">

        <img
          src="${product.images?.[0]}"
          class="w-full h-52 object-cover"
        />

        <div class="p-4">

          <h3 class="font-semibold line-clamp-2">
            ${product.name}
          </h3>

          <div class="text-sm text-gray-500 mt-2">
            ${product.sellerName || 'Official Store'}
          </div>

          <div class="text-green-600 font-bold text-lg mt-2">
            Rp ${product.price}
          </div>

          <button
            class="btn-primary w-full mt-4"
          >
            + Keranjang
          </button>

        </div>

      </div>

    `).join('');

}

function renderFlashSale(
  products
) {

  flashSale.innerHTML =
    products.map(product => `

      <div class="product-card">

        <img
          src="${product.images?.[0]}"
          class="w-full h-40 object-cover"
        />

        <div class="p-3">

          <div class="font-semibold">
            ${product.name}
          </div>

          <div class="text-red-500 font-bold mt-2">
            Rp ${product.price}
          </div>

        </div>

      </div>

    `).join('');

}

init();
