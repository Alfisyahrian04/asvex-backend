import {
  request
}
from '../api/api.js';

const container =
document.getElementById(
  'adminStats'
);

async function init() {

  const response =
    await request(
      '/admin/dashboard'
    );

  container.innerHTML = `

    <div class="bg-white rounded-3xl p-6">

      <div class="text-gray-500">
        Users
      </div>

      <div class="text-3xl font-bold mt-2">
        ${response.users}
      </div>

    </div>

    <div class="bg-white rounded-3xl p-6">

      <div class="text-gray-500">
        Products
      </div>

      <div class="text-3xl font-bold mt-2">
        ${response.products}
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
