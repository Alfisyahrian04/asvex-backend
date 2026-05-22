import {
  request
}
from '../api/api.js';

const container =
document.getElementById(
  'sellerStats'
);

async function init() {

  const response =
    await request(
      '/seller/dashboard'
    );

  container.innerHTML = `

    <div class="bg-white rounded-3xl p-6">

      <div class="text-gray-500">
        Produk
      </div>

      <div class="text-3xl font-bold mt-2">
        ${response.products}
      </div>

    </div>

    <div class="bg-white rounded-3xl p-6">

      <div class="text-gray-500">
        Order
      </div>

      <div class="text-3xl font-bold mt-2">
        ${response.totalOrders}
      </div>

    </div>

    <div class="bg-white rounded-3xl p-6">

      <div class="text-gray-500">
        Revenue
      </div>

      <div class="text-3xl font-bold mt-2">
        Rp ${response.revenue}
      </div>

    </div>

  `;

}

init();
