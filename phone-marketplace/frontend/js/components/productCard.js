export default function productCard(
product
) {

  const image =
product.images?.[0]
||
'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop';
  return `

    <div
      class="product-card"
      onclick="
        window.location.href=
        'product.html?id=${product._id}'
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
