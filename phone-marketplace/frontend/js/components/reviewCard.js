export default function reviewCard(
review
) {

  return `

    <div
      class="bg-white p-5 rounded-3xl"
    >

      <div
        class="flex justify-between mb-3"
      >

        <div class="font-bold">
          ${review.username}
        </div>

        <div class="text-yellow-500">
          ⭐ ${review.rating}
        </div>

      </div>

      <p class="text-gray-600">
        ${review.comment}
      </p>

    </div>

  `;

}
