export default function imageSlider(
images = []
) {

  return `

    <div
      class="overflow-hidden rounded-3xl"
    >

      <div
        class="flex gap-4 overflow-x-auto"
      >

        ${images.map(image => `

          <img
            src="${image}"
            class="w-full h-64 object-cover rounded-3xl"
          />

        `).join('')}

      </div>

    </div>

  `;

}
