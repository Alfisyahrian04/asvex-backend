export default function ratingStars(
rating = 5
) {

  return `

    <div class="text-yellow-500">

      ${'⭐'.repeat(
        Math.round(rating)
      )}

    </div>

  `;

}
