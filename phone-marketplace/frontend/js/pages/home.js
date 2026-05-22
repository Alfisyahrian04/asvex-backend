const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

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

const usernameEl =
document.getElementById(
'username'
);

if(usernameEl){

usernameEl.innerText =
user?.username || 'User';

}

const productContainer =
document.getElementById(
'product-list'
);

async function loadProducts(){

try{

const response =
await fetch(
`${BASE_URL}/products`
);

const data =
await response.json();

if(
!response.ok
){

throw new Error();

}

renderProducts(
data.products || data
);

}catch(err){

console.log(err);

productContainer.innerHTML = `
<div class="empty-product">
Produk tidak tersedia
</div>
`;

}

}

function renderProducts(products){

if(!products.length){

productContainer.innerHTML = `
<div class="empty-product">
Belum ada produk
</div>
`;

return;

}

productContainer.innerHTML =
products.map(product=>`

<div class="product-card">

<div class="product-image">

<img
src="${product.image}"
alt="${product.name}"
/>

</div>

<div class="product-info">

<h3>
${product.name}
</h3>

<p class="price">
Rp ${Number(product.price)
.toLocaleString('id-ID')}
</p>

<button
class="buy-btn"
onclick='addToCart(${JSON.stringify(product)})'
>

+ Keranjang

</button>

</div>

</div>

`).join('');

}

function addToCart(product){

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
'Produk ditambahkan'
);

}

function updateCartCount(){

const cart =
JSON.parse(
localStorage.getItem('cart')
) || [];

const cartCount =
document.getElementById(
'cart-count'
);

if(cartCount){

cartCount.innerText =
cart.length;

}

}

updateCartCount();

loadProducts();
