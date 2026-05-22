let cart =
JSON.parse(
  localStorage.getItem(
    'cart'
  )
) || [];

const container =
document.getElementById(
  'cart-items'
);

const totalEl =
document.getElementById(
  'cart-total'
);

function renderCart() {

  if (!cart.length) {

    container.innerHTML = `

      <div class="empty-cart">

        Keranjang kosong

      </div>

    `;

    totalEl.innerText =
      'Rp 0';

    return;

  }

  container.innerHTML =
    cart.map((item, index) => `

      <div class="cart-card">

        <img
          src="${
            item.images?.[0]
          }"
        />

        <div class="cart-info">

          <h3>
            ${item.name}
          </h3>

          <p>
            Rp ${Number(
              item.price
            ).toLocaleString()}
          </p>

          <button
            onclick="
              removeCart(
                ${index}
              )
            "
          >

            Hapus

          </button>

        </div>

      </div>

    `).join('');

  const total =
    cart.reduce(
      (
        acc,
        item
      ) =>

        acc + item.price,

      0
    );

  totalEl.innerText =
    `Rp ${total.toLocaleString()}`;

}

window.removeCart =
function(index) {

  cart.splice(index, 1);

  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );

  renderCart();

};

document.getElementById(
  'checkout-btn'
).addEventListener(
  'click',
  () => {

    alert(
      'Checkout berhasil'
    );

    localStorage.removeItem(
      'cart'
    );

    cart = [];

    renderCart();

  }
);

renderCart();
