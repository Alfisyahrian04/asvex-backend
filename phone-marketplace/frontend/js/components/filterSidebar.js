export default function filterSidebar() {

  return `

    <aside class="bg-white p-5 rounded-3xl">

      <h2 class="font-bold text-xl mb-4">
        Filter
      </h2>

      <div class="mb-4">

        <label class="font-semibold">
          Kategori
        </label>

        <select
          class="w-full border p-3 rounded-2xl mt-2"
        >

          <option>
            Semua
          </option>

          <option>
            Smartphone
          </option>

          <option>
            Tablet
          </option>

        </select>

      </div>

      <div class="mb-4">

        <label class="font-semibold">
          Harga
        </label>

        <input
          type="number"
          placeholder="Min"
          class="w-full border p-3 rounded-2xl mt-2"
        />

      </div>

    </aside>

  `;

}
