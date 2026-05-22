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

    checkout();

    localStorage.removeItem(
      'cart'
    );

    cart = [];

    renderCart();

  }
);

renderCart();

async function checkout() {

  const token =
    localStorage.getItem(
      'token'
    );

  if (!token) {

    alert(
      'Login dulu'
    );

    window.location.href =
      './login.html';

    return;

  }

  try {

    const response =
      await fetch(

        'https://asvex-backend-production.up.railway.app/api/v1/orders',

        {

          method: 'POST',

          headers: {

            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`

          },

          body:
            JSON.stringify({

              items: cart

            })

        }

      );

    const data =
      await response.json();

    if (data.success) {

      alert(
        'Checkout berhasil'
      );

      localStorage.removeItem(
        'cart'
      );

      window.location.href =
        './orders.html';

    } else {

      alert(
        data.message
      );

    }

  } catch (err) {

    console.error(err);

    alert(
      'Checkout gagal'
    );

  }

}
