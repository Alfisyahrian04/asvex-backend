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

function getItemStock(item){

  return Number(
    item.stock ||
    item.totalStock ||
    item.qty ||
    0
  );

}

function normalizeCartQty() {

  cart = cart.map(item => {

    const stock =
      getItemStock(item);

    let qty =
      Number(item.quantity || 1);

    if (qty < 1) qty = 1;

    if (
      stock > 0 &&
      qty > stock
    ) {
      qty = stock;
    }

    return {
      ...item,
      quantity: qty
    };

  });

  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );

}

function renderCart() {

  normalizeCartQty();

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
          src="${item.images?.[0]}"
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

          <p>
            Stock:
            ${getItemStock(item)}
          </p>

          <div
            class="cart-qty-control"
            style="
              display:flex;
              gap:8px;
              align-items:center;
              margin:10px 0;
            "
          >

            <button
              onclick="decreaseQty(${index})"
            >
              -
            </button>

            <span>
              ${item.quantity || 1}
            </span>

            <button
              onclick="increaseQty(${index})"
            >
              +
            </button>

          </div>

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

        acc + (
          item.price *
          (item.quantity || 1)
        ),

      0
    );

  totalEl.innerText =
    `Rp ${total.toLocaleString()}`;

}

window.increaseQty =
function(index) {

  const item =
    cart[index];

  if (!item) return;

  const stock =
    getItemStock(item);

  if (
    stock &&
    item.quantity >= stock
  ) {

    item.quantity = stock;

    localStorage.setItem(
      'cart',
      JSON.stringify(cart)
    );

    alert(
      'Stok tidak mencukupi'
    );

    renderCart();
    return;

  }

  item.quantity += 1;

  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );

  renderCart();

};

window.decreaseQty =
function(index) {

  const item =
    cart[index];

  if (!item) return;

  if (
    item.quantity > 1
  ) {

    item.quantity -= 1;

  }

  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );

  renderCart();

};

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
  async () => {

    await checkout();

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

  if(!cart.length){

    alert(
      'Keranjang kosong'
    );

    return;

  }

  try {

    for(const item of cart){

      const response =
        await fetch(
          'https://asvex-backend-production.up.railway.app/api/v1/orders',
          {
            method:'POST',
            headers:{
              'Content-Type':'application/json',
              Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({
              productId:item._id,
              quantity:item.quantity || 1,
              shippingAddress:'',
              paymentMethod:'manual_transfer',
              paymentProof:''
            })
          }
        );

      const data =
        await response.json();

      if(!response.ok){

        alert(
          data.message ||
          'Checkout gagal'
        );

        return;

      }

    }

    alert(
      'Checkout berhasil'
    );

    localStorage.removeItem(
      'cart'
    );

    cart = [];

    renderCart();

    window.location.href =
      './orders.html';

  } catch (err) {

    console.error(err);

    alert(
      'Checkout gagal'
    );

  }

}
