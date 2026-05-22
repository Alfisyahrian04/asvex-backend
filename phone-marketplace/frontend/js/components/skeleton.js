export default function skeleton(
count = 8
) {

  return Array(count)
    .fill(0)
    .map(() => `

      <div class="bg-white rounded-3xl overflow-hidden animate-pulse">

        <div class="bg-gray-200 h-52"></div>

        <div class="p-4">

          <div class="bg-gray-200 h-4 rounded w-3/4 mb-3"></div>

          <div class="bg-gray-200 h-4 rounded w-1/2"></div>

        </div>

      </div>

    `).join('');

}
