const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

const currentUser =
JSON.parse(
localStorage.getItem(
'user'
)
);

const token =
localStorage.getItem(
'token'
);

/* AUTH */

if(
!currentUser ||
currentUser.role !==
'seller'
){

window.location.href =
'login.html';

}

/* ELEMENT */

const productList =
document.getElementById(
'seller-product-list'
);

const productModal =
document.getElementById(
'product-modal'
);

const openModalBtn =
document.getElementById(
'open-product-modal'
);

const saveProductBtn =
document.getElementById(
'save-product-btn'
);

/* OPEN MODAL */

if(
openModalBtn
){

openModalBtn.addEventListener(
'click',
()=>{

productModal.style.display =
'flex';

}
);

}

/* CLOSE MODAL */

if(
productModal
){

productModal.addEventListener(
'click',
(e)=>{

if(
e.target ===
productModal
){

productModal.style.display =
'none';

}

}
);

}

/* LOAD PRODUCTS */

async function loadSellerProducts(){

try{

const response =
await fetch(
`${BASE_URL}/products/my-products`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const data =
await response.json();

if(
!response.ok
){

console.log(data);

return;

}

renderProducts(
data.products || []
);

}catch(error){

console.log(error);

}

}

/* RENDER PRODUCTS */

function renderProducts(
products
){

if(
!productList
){

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
'https://via.placeholder.com/300x300'
}"
alt="${product.name}"
>

<h3>
${product.name}
</h3>

<p>
Rp ${
Number(
product.price || 0
).toLocaleString(
'id-ID'
)
}
</p>

</div>

`).join('');

}

/* CREATE PRODUCT */

if(
saveProductBtn
){

saveProductBtn.addEventListener(
'click',
async()=>{

const name =
document.getElementById(
'product-name'
).value.trim();

const description =
document.getElementById(
'product-description'
).value.trim();

const price =
document.getElementById(
'product-price'
).value.trim();

const imageInput =
document.getElementById(
'product-image'
);

if(
!name ||
!description ||
!price
){

alert(
'Lengkapi data produk'
);

return;

}

saveProductBtn.disabled =
true;

saveProductBtn.innerText =
'Uploading...';

try{

let imageBase64 = '';

if(
imageInput.files[0]
){

const file =
imageInput.files[0];

imageBase64 =
await convertToBase64(
file
);

}

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
description,
price,
images:[imageBase64],
category:'General',
productType:'physical',
seller:
currentUser.id

})

}
);

const data =
await response.json();

if(
!response.ok
){

alert(
data.message ||
'Gagal upload produk'
);

saveProductBtn.disabled =
false;

saveProductBtn.innerText =
'Upload Produk';

return;

}

alert(
'Produk berhasil ditambahkan'
);

/* RESET */

document.getElementById(
'product-name'
).value = '';

document.getElementById(
'product-description'
).value = '';

document.getElementById(
'product-price'
).value = '';

document.getElementById(
'product-image'
).value = '';

productModal.style.display =
'none';

loadSellerProducts();

}catch(error){

console.log(error);

alert(
'Server error'
);

}

saveProductBtn.disabled =
false;

saveProductBtn.innerText =
'Upload Produk';

}
);

}

/* IMAGE CONVERT */

function convertToBase64(
file
){

return new Promise(
(resolve,reject)=>{

const reader =
new FileReader();

reader.readAsDataURL(
file
);

reader.onload =
()=>resolve(
reader.result
);

reader.onerror =
error=>reject(
error
);

}
);

}

/* INIT */

loadSellerProducts();
