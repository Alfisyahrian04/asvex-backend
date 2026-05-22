export default function productCard(
product
) {

  const image =
    product.images?.[0]
    || 'https://via.placeholder.com/300';

  return `

    <div
      class="product-card"
      onclick="
        alert(
          '${product.name}'
        )
      "
    >

      <div class="product-image">

        <img
          src="${image}"
          alt="${product.name}"
        />

      </div>

      <div class="product-info">

        <div class="product-title">
          ${product.name}
        </div>

        <div class="product-price">
          Rp ${Number(
            product.price
          ).toLocaleString()}
        </div>

        <div class="product-meta">

          ⭐ 4.9 • Terjual 120

        </div>

      </div>

    </div>

  `;

}
