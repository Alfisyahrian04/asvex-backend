const token =
localStorage.getItem(
  'token'
);

if (!token) {

  window.location.href =
    './login.html';

}

async function loadOrders() {

  try {

    const response =
      await fetch(

        'https://asvex-backend-production.up.railway.app/api/v1/orders',

        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      );

    const orders =
      await response.json();

    renderOrders(
      orders
    );

  } catch (err) {

    console.error(err);

  }

}

function renderOrders(
orders
) {

  const container =
    document.getElementById(
      'orders-list'
    );

  if (!orders.length) {

    container.innerHTML = `

      <div class="empty-cart">

        Belum ada pesanan

      </div>

    `;

    return;

  }

  container.innerHTML =
    orders.map(order => `

      <div class="order-card">

        <h3>
          ${order.product?.name || 'Produk'}
        </h3>

        <p>
          Status:
          ${order.status}
        </p>

        <p>
          Total:
          Rp ${Number(
            order.totalPrice || 0
          ).toLocaleString()}
        </p>

      </div>

    `).join('');

}

loadOrders();
