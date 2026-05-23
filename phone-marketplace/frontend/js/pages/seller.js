const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

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

const token =
localStorage.getItem(
'token'
);

async function
loadSellerProducts(){

try{

const response =
await fetch(
`${BASE_URL}/products/seller/my-products`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const products =
await response.json();

const productList =
document.getElementById(
'seller-product-list'
);

if(!productList){

return;

}

if(
!products.length
){

productList.innerHTML =
`
<div class="empty-state">
Belum ada produk
</div>
`;

return;

}

productList.innerHTML =
products.map(product=>`

<div class="product-card">

<img
src="${
product.image ||
'https://via.placeholder.com/300'
}"
>

<h3>
${product.name}
</h3>

<p>
Rp ${
Number(
product.price
).toLocaleString(
'id-ID'
)
}
</p>

<p>
Stock:
${product.stock}
</p>

</div>

`).join('');

}catch(error){

console.log(error);

}

}

async function
loadSellerStats(){

try{

const response =
await fetch(
`${BASE_URL}/orders/seller/stats`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const data =
await response.json();

const walletBalance =
document.getElementById(
'wallet-balance'
);

const monthlyRevenue =
document.getElementById(
'monthly-revenue'
);

const totalOrders =
document.getElementById(
'total-orders'
);

if(walletBalance){

walletBalance.innerText =
`Rp ${Number(
data.balance || 0
).toLocaleString(
'id-ID'
)}`;

}

if(monthlyRevenue){

monthlyRevenue.innerText =
`Rp ${Number(
data.monthlyRevenue || 0
).toLocaleString(
'id-ID'
)}`;

}

if(totalOrders){

totalOrders.innerText =
`${data.totalOrders || 0} UNIT`;

}

}catch(error){

console.log(error);

}

}

function
openProductModal(){

const modal =
document.getElementById(
'product-modal'
);

if(modal){

modal.style.display =
'flex';

}

}

async function
createProduct(){

const name =
document.getElementById(
'product-name'
).value;

const price =
document.getElementById(
'product-price'
).value;

const stock =
document.getElementById(
'product-stock'
).value;

const category =
document.getElementById(
'product-category'
).value;

const brand =
document.getElementById(
'product-brand'
).value;

const image =
document.getElementById(
'product-image'
).value;

const description =
document.getElementById(
'product-description'
).value;

const productType =
document.getElementById(
'product-type'
).value;

try{

const response =
await fetch(
`${BASE_URL}/products`,
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
stock,
category,
brand,
image,
description,
productType

})

}
);

const data =
await response.json();

if(!response.ok){

alert(
data.message ||
'Gagal upload produk'
);

return;

}

alert(
'Produk berhasil dibuat'
);

window.location.reload();

}catch(error){

console.log(error);

alert(
'Server error'
);

}

}

window.openProductModal =
openProductModal;

window.createProduct =
createProduct;

loadSellerProducts();

loadSellerStats();
