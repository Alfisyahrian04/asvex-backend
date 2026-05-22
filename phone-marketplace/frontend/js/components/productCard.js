export default function productCard(
  product
) {

  return `

  <div class="product-card">

    <div class="product-image-wrap">

      <img
        src="${product.image}"
        class="product-image"
      />

      <div class="product-badge">
        HOT
      </div>

    </div>

    <div class="product-content">

      <div class="product-category">

        ${product.category || 'SMARTPHONE'}

      </div>

      <h3 class="product-title">

        ${product.name}

      </h3>

      <div class="product-price">

        Rp ${Number(
          product.price
        ).toLocaleString('id-ID')}

      </div>

      <div class="product-meta">

        ⭐ 4.9 • Terjual 120

      </div>

      <button
        class="buy-btn"
        onclick='addToCart(
          ${JSON.stringify(product)}
        )'
      >

        + Keranjang

      </button>

    </div>

  </div>

  `;

}
