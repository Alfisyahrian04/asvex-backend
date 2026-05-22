export default function flashSale(
  products
) {

  return products.map(product => `

    <div class="product-card">

      <img
        src="${product.images?.[0]}"
        class="w-full h-40 object-cover"
      />

      <div class="p-3">

        <div class="font-semibold">
          ${product.name}
        </div>

        <div class="text-red-500 font-bold mt-2">
          Rp ${product.price}
        </div>

      </div>

    </div>

  `).join('');

}
