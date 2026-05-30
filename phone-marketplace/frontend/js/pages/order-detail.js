const params = new URLSearchParams(window.location.search);
const orderId = params.get('id');

const container =
document.getElementById('order-detail-container');

async function loadOrderDetail() {
  try {

    const response = await fetch(
      `${window.API_URL}/orders/${orderId}`,
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    const data = await response.json();

    const order =
      data.order || data;

    const item =
      order.items?.[0] || {};

    const product =
      item.product || {};

    const image =
      product.images?.[0] ||
      'https://via.placeholder.com/300';

    container.innerHTML = `
      <div class="detail-card">

        <div class="detail-section">
          <h3>Pesanan Selesai</h3>
        </div>

        <div class="detail-section">
          <div class="product-row">

            <img
              src="${image}"
              class="detail-product-image"
            />

            <div class="detail-product-info">
              <h3>${product.name || 'Produk'}</h3>

              <p>Qty: ${item.quantity || order.quantity || 1}</p>

              <p class="price">
                Rp ${Number(
                  item.price || order.totalPrice || 0
                ).toLocaleString('id-ID')}
              </p>
            </div>

          </div>
        </div>

        <div class="detail-section">
          <h3>Info Pengiriman</h3>

          <p>
            Kurir:
            ${order.shippingCourier || '-'}
          </p>

          <p>
            No Resi:
            ${order.trackingNumber || '-'}
          </p>

          <p>
            Alamat:
            ${order.shippingAddress?.fullName || ''}
            <br>
            ${order.shippingAddress?.phone || ''}
            <br>
            ${order.shippingAddress?.address || ''}
          </p>
        </div>

        <div class="detail-section">
          <h3>Rincian Pembayaran</h3>

          <p>
            Metode:
            ${order.paymentMethod || '-'}
          </p>

          <p>
            Total:
            Rp ${Number(
              order.totalPrice || 0
            ).toLocaleString('id-ID')}
          </p>
        </div>

      </div>
    `;

  } catch (error) {

    console.log(error);

    container.innerHTML = `
      <div class="empty-product">
        Gagal memuat detail pesanan
      </div>
    `;
  }
}

loadOrderDetail();
