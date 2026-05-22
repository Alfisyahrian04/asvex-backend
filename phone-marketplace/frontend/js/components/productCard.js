export default function productCard(
  product
) {

  return `

    <div class="product-card">

      <img
        src="${product.images?.[0]}"
        class="w-full h-52 object-cover"
      />

      <div class="p-4">

        <div class="font-semibold line-clamp-2">
          ${product.name}
        </div>

        <div class="text-sm text-gray-500 mt-2">
          ${product.sellerName}
        </div>

        <div class="text-lg font-bold text-green-600 mt-2">
          Rp ${product.price}
        </div>

        <button
          class="btn-primary w-full mt-4"
        >
          + Keranjang
        </button>

      </div>

    </div>

  `;

}
