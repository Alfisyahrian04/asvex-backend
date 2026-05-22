export default function swipeDrawer(
content
) {

  return `

    <div
      class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6"
    >

      ${content}

    </div>

  `;

}
