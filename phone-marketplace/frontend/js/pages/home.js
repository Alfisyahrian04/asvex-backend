const token =
localStorage.getItem('token');

if(!token){

window.location.href =
'login.html';

}

const user =
JSON.parse(
localStorage.getItem('user')
);

const username =
document.getElementById(
'username'
);

if(user){

username.innerText =
user.username;

}

const productList =
document.getElementById(
'product-list'
);

const cartCount =
document.getElementById(
'cart-count'
);

function updateCartCount(){

const cart =
JSON.parse(
localStorage.getItem('cart')
) || [];

cartCount.innerText =
cart.length;

}

async function loadProducts(){

try{

const response =
await fetch(
'https://asvex-backend-production.up.railway.app/api/products'
);

const data =
await response.json();

const products =
data.products || data;

if(!products.length){

productList.innerHTML = `
<div class="empty-product">
Produk kosong
</div>
`;

return;

}

productList.innerHTML =
products.map(product=>`

<div class="product-card">

<img
src="${product.image}"
alt="${product.name}"
class="product-image"
/>

<div class="product-content">

<h3>
${product.name}
</h3>

<p class="product-price">
Rp ${Number(product.price)
.toLocaleString('id-ID')}
</p>

<button
class="buy-btn"
onclick='addToCart(${JSON.stringify(product)})'
>

Tambah Keranjang

</button>

</div>

</div>

`).join('');

}catch(error){

productList.innerHTML = `
<div class="empty-product">
Gagal memuat produk
</div>
`;

}

}

window.addToCart = function(product){

let cart =
JSON.parse(
localStorage.getItem('cart')
) || [];

cart.push(product);

localStorage.setItem(
'cart',
JSON.stringify(cart)
);

updateCartCount();

alert(
'Produk masuk keranjang'
);

};

updateCartCount();
loadProducts();
