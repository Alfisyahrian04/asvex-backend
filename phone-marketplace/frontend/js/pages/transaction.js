const transactionList =
document.getElementById(
  'transaction-list'
);

const orders =
JSON.parse(
  localStorage.getItem(
    'orders'
  )
) || [];

function renderOrders() {

  if (!orders.length) {

    transactionList.innerHTML = `

      <div class="empty-state">

        Belum ada transaksi

      </div>

    `;

    return;

  }

  transactionList.innerHTML =
  orders.map(order => `

    <div class="history-card">

      <div class="history-top">

        <div class="invoice">

          INV-${order.id}

        </div>

        <div class="status">

          ${order.status || 'DIKIRIM'}

        </div>

      </div>

      <div class="history-product">

        ${order.name}

      </div>

      <div class="history-total">

        Total: Rp ${Number(
          order.price
        ).toLocaleString('id-ID')}

      </div>

    </div>

  `).join('');

}

renderOrders();
