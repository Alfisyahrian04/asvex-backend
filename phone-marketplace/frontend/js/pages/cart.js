let cart =
  JSON.parse(
    localStorage.getItem('cart')
  ) || [];

const container =
  document.getElementById('cart-items');

const totalEl =
  document.getElementById('cart-total');

let productsCache = [];

async function loadProductsCache(){

  try{

    const products =
      await fetchProducts();

    productsCache =
      products || [];

  }catch(error){

    console.log(error);

  }

}

function getLiveProductStock(item){

  const product =
    productsCache.find(
      p => p._id === item._id
    );

  if(product){

    return Number(
      product.stock ??
      product.totalStock ??
      product.countInStock ??
      0
    );

  }

  return Number(
    item.stock ??
    item.totalStock ??
    item.countInStock ??
    0
  );

}

function normalizeCartQty(){

  cart = cart.map(item=>{

    const stock =
      getLiveProductStock(item);

    let qty =
      Number(item.quantity || 1);

    if(qty < 1){
      qty = 1;
    }

    if(
      stock > 0 &&
      qty > stock
    ){
      qty = stock;
    }

    return{
      ...item,
      stock,
      quantity: qty
    };

  });

  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );

}

function renderCart(){

  normalizeCartQty();

  if(!cart.length){

    container.innerHTML = `
      <div class="empty-cart">
        Keranjang kosong
      </div>
    `;

    totalEl.innerText='Rp 0';
    return;

  }

  container.innerHTML =
    cart.map((item,index)=>`

      <div class="cart-card">

        <img src="${item.images?.[0] || ''}" />

        <div class="cart-info">

          <h3>${item.name}</h3>

          <p>
            Rp ${Number(item.price).toLocaleString('id-ID')}
          </p>

          <p>
            Stock:
            ${item.stock || 0}
          </p>

          <div class="cart-qty-control">

            <button onclick="decreaseQty(${index})">-</button>

            <span>${item.quantity}</span>

            <button
              onclick="increaseQty(${index})"
              ${item.quantity >= item.stock ? 'disabled' : ''}
            >
              +
            </button>

          </div>

          <button onclick="removeCart(${index})">
            Hapus
          </button>

        </div>

      </div>

    `).join('');

  const total =
    cart.reduce(
      (acc,item)=>
        acc +
        (
          Number(item.price) *
          Number(item.quantity)
        ),
      0
    );

  totalEl.innerText =
    `Rp ${total.toLocaleString('id-ID')}`;

}

window.increaseQty = function(index){

  const item =
    cart[index];

  if(!item) return;

  const stock =
    getLiveProductStock(item);

  const qty =
    Number(item.quantity || 1);

  if(qty >= stock){

    item.quantity = stock;

    localStorage.setItem(
      'cart',
      JSON.stringify(cart)
    );

    alert(
      `Stok tersedia hanya ${stock}`
    );

    renderCart();
    return;

  }

  item.quantity = qty + 1;

  if(item.quantity > stock){
    item.quantity = stock;
  }

  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );

  renderCart();

};

window.decreaseQty = function(index){

  if(cart[index].quantity > 1){
    cart[index].quantity -= 1;
  }

  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );

  renderCart();

};

window.removeCart = function(index){

  cart.splice(index,1);

  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );

  renderCart();

};

async function initCart(){

  await loadProductsCache();
  renderCart();

}

initCart();
