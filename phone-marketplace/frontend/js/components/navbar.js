export default function navbar() {

  return `

    <nav class="navbar">

      <a
        href="/index.html"
        class="text-2xl font-bold text-green-600"
      >
        PHONE MARKET
      </a>

      <input
        type="text"
        placeholder="Cari HP..."
        class="border p-3 rounded-2xl w-full max-w-xl"
      />

      <div class="flex gap-3">

        <a href="/orders.html">
          Orders
        </a>

        <a href="/login.html">
          Login
        </a>

      </div>

    </nav>

  `;

}
