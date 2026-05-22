const container =
document.getElementById(
  'ordersContainer'
);

const orders =
JSON.parse(
  localStorage.getItem(
    'orders'
  ) || '[]'
);

container.innerHTML =
orders.map(order => `

  <div class="bg-white p-5 rounded-3xl">

    <div class="flex justify-between">

      <div>

        <div class="font-bold">
          ${order.orderId}
        </div>

        <div class="text-sm text-gray-500">
          ${order.status}
        </div>

      </div>

      <div class="font-bold text-green-600">
        Rp ${order.total}
      </div>

    </div>

  </div>

`).join('');
