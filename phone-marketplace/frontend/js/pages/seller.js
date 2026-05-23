const currentUser =
JSON.parse(
localStorage.getItem(
'user'
)
);

if(
!currentUser
){

window.location.href =
'login.html';

}

if(
currentUser.role !==
'seller'
){

window.location.href =
'index.html';

}

const sellerUsername =
document.getElementById(
'seller-username'
);

if(sellerUsername){

sellerUsername.innerText =
currentUser.username;

}
protectPage();

requireRole('seller');

const token =
localStorage.getItem(
'token'
);

const API_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

async function loadWallet(){

try{

const response =
await fetch(
`${API_URL}/seller/wallet`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const wallet =
await response.json();

document.getElementById(
'wallet-balance'
).innerText =

`Rp ${Number(wallet.balance)
.toLocaleString('id-ID')}`;

}catch(error){

console.log(error);

}

}

async function loadAnalytics(){

try{

const response =
await fetch(
`${API_URL}/seller/analytics`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const analytics =
await response.json();

document.getElementById(
'total-products'
).innerText =
analytics.totalProducts;

document.getElementById(
'total-orders'
).innerText =
analytics.totalOrders;

document.getElementById(
'total-revenue'
).innerText =

`Rp ${Number(analytics.revenue)
.toLocaleString('id-ID')}`;

}catch(error){

console.log(error);

}

}

async function loadProducts(){

try{

const response =
await fetch(
`${API_URL}/seller/products`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const products =
await response.json();

renderProducts(
products
);

}catch(error){

console.log(error);

}

}

function renderProducts(products){

const container =
document.getElementById(
'seller-product-list'
);

if(!products.length){

container.innerHTML = `

<div class="empty-product">

Belum ada produk

</div>

`;

return;

}

container.innerHTML =
products.map(product=>`

<div class="seller-product-card">

<img
src="${
product.images?.[0]
}"
alt="${product.name}"
>

<h3>
${product.name}
</h3>

<p>
Rp ${Number(product.price)
.toLocaleString('id-ID')}
</p>

<p>
Stock:
${product.stock}
</p>

<p class="
${
product.stock <= 5
? 'low-stock'
: ''
}
">

${
product.stock <= 5
? '⚠ Stock Menipis'
: 'Stock Aman'
}

</p>

<button
onclick="
deleteProduct(
'${product._id}'
)
"
>

Hapus

</button>

</div>

`).join('');

}

function openProductModal(){

document.getElementById(
'product-modal'
).style.display =
'flex';

}

async function createProduct(){

try{

const name =
document.getElementById(
'product-name'
).value;

const price =
document.getElementById(
'product-price'
).value;

const category =
document.getElementById(
'product-category'
).value;

const image =
document.getElementById(
'product-image'
).value;

const description =
document.getElementById(
'product-description'
).value;

const stock =
document.getElementById(
'product-stock'
).value;

const response =
await fetch(
`${API_URL}/products`,
{
method:'POST',

headers:{
'Content-Type':
'application/json',

Authorization:
`Bearer ${token}`
},

body:JSON.stringify({

name,
price,
category,
description,

images:[image],

stock:Number(stock)

})

}
);

if(!response.ok){

throw new Error();

}

alert(
'Produk berhasil dibuat'
);

document.getElementById(
'product-modal'
).style.display =
'none';

loadProducts();

loadAnalytics();

}catch(error){

alert(
'Gagal membuat produk'
);

}

}

async function deleteProduct(id){

try{

await fetch(
`${API_URL}/products/${id}`,
{
method:'DELETE',

headers:{
Authorization:
`Bearer ${token}`
}
}
);

loadProducts();

loadAnalytics();

}catch(error){

console.log(error);

}

}

loadWallet();

loadAnalytics();

loadProducts();
