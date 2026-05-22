export default function cartDrawer(
cart = []
) {

  return `

    <div
      class="fixed top-0 right-0 w-full max-w-md h-screen bg-white shadow-2xl p-6 overflow-y-auto"
    >

      <div class="flex justify-between items-center mb-6">

        <h2 class="text-2xl font-bold">
          Keranjang
        </h2>

        <button id="closeCart">
          ✕
        </button>

      </div>

      <div class="space-y-4">

        ${cart.map(item => `

          <div class="flex gap-4">

            <img
              src="${item.images?.[0]}"
              class="w-20 h-20 rounded-2xl object-cover"
            />

            <div class="flex-1">

              <div class="font-semibold">
                ${item.name}
              </div>

              <div class="text-green-600 font-bold mt-2">
                Rp ${item.price}
              </div>

            </div>

          </div>

        `).join('')}

      </div>

      <button
        class="btn-primary w-full mt-6"
      >
        Checkout
      </button>

    </div>

  `;

}
