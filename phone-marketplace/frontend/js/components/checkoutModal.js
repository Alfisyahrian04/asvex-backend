export default function checkoutModal(
{
  total
}
) {

  return `

    <div
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    >

      <div
        class="bg-white rounded-3xl p-8 w-full max-w-lg"
      >

        <h2
          class="text-3xl font-bold mb-6"
        >
          Checkout
        </h2>

        <input
          type="text"
          placeholder="Alamat lengkap"
          class="w-full border p-4 rounded-2xl mb-4"
        />

        <select
          class="w-full border p-4 rounded-2xl mb-4"
        >

          <option>
            Transfer Bank
          </option>

          <option>
            E-Wallet
          </option>

        </select>

        <div
          class="text-2xl font-bold text-green-600 mb-6"
        >
          Rp ${total}
        </div>

        <button
          class="btn-primary w-full"
        >
          Bayar Sekarang
        </button>

      </div>

    </div>

  `;

}
