const params =
new URLSearchParams(
  window.location.search
);

const id =
params.get('id');

async function loadProduct() {

  try {

    const response =
      await fetch(

        `https://asvex-backend-production.up.railway.app/api/v1/products`

      );

    const products =
      await response.json();

    const product =
      products.find(
        item => item._id === id
      );

    if (!product) {

      document.getElementById(
        'product-detail'
      ).innerHTML =

      `
        <h2>
          Produk tidak ditemukan
        </h2>
      `;

      return;

    }

    renderProduct(product);

  } catch (err) {

    console.error(err);

  }

}

function renderProduct(product) {

  const image =
    product.images?.[0]
    || '';

  document.getElementById(
    'product-detail'
  ).innerHTML = `

    <div class="detail-card">

      <img
        src="${image}"
        class="detail-image"
      />

      <div class="detail-info">

        <h1>
          ${product.name}
        </h1>

        <div class="detail-price">

          Rp ${Number(
            product.price
          ).toLocaleString()}

        </div>

        <div class="detail-rating">

          ⭐ 4.9 • Terjual 120

        </div>

        <p class="detail-desc">

          ${product.description}

        </p>

        <button
          class="btn-primary"
          onclick='addToCart(
            ${JSON.stringify(product)}
          )'
        >

          + Tambah Keranjang

        </button>

      </div>

    </div>

  `;

}

window.addToCart =
function(product) {

  let cart =
  JSON.parse(
    localStorage.getItem(
      'cart'
    )
  ) || [];

  cart.push(product);

  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );

  alert(
    'Produk masuk keranjang'
  );

};

loadProduct();
