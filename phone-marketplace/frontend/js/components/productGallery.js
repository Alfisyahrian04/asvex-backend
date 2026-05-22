export default function productGallery(
images = []
) {

  return `

    <div>

      <img
        src="${images[0]}"
        class="w-full h-[450px] object-cover rounded-3xl"
      />

      <div
        class="flex gap-3 mt-4"
      >

        ${images.map(image => `

          <img
            src="${image}"
            class="w-20 h-20 rounded-2xl object-cover border cursor-pointer"
          />

        `).join('')}

      </div>

    </div>

  `;

}
