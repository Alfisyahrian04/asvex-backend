const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

const currentUser =
JSON.parse(
localStorage.getItem('user')
);

const token =
localStorage.getItem('token');

if(
!currentUser ||
currentUser.role !== 'seller'
){
window.location.href = 'login.html';
}

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

if(openModalBtn){
openModalBtn.addEventListener(
'click',
()=>{
productModal.style.display='flex';
}
);
}

if(productModal){
productModal.addEventListener(
'click',
(e)=>{
if(e.target===productModal){
productModal.style.display='none';
}
}
);
}

async function loadSellerProducts(){

try{

const response =
await fetch(
`${BASE_URL}/products/my-products`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const data =
await response.json();

renderProducts(
data.products || []
);

}catch(error){
console.log(error);
}

}

function renderProducts(products){

if(!products.length){

productList.innerHTML=
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
product.images?.[0] ||
'https://via.placeholder.com/300'
}"
alt="${product.name}"
>

<h3>${product.name}</h3>

<p>
Rp ${Number(
product.price || 0
).toLocaleString('id-ID')}
</p>

<p>
Stok:
<b>${product.stock ?? 0}</b>
</p>

<p>
Kategori:
<b>${product.category || '-'}</b>
</p>

<p>
Kondisi:
<b>${product.condition || '-'}</b>
</p>

<button
onclick="deleteProduct('${product._id}')"
style="
margin-top:10px;
background:#dc2626;
color:white;
border:none;
padding:10px;
width:100%;
border-radius:12px;
font-weight:600;
"
>
Hapus Produk
</button>

</div>

`).join('');

}

if(saveProductBtn){

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

const stock =
document.getElementById(
'product-stock'
).value.trim();

const category =
document.getElementById(
'product-category'
)?.value.trim() || 'General';

const condition =
document.getElementById(
'product-condition'
)?.value || 'Baru';

const weight =
document.getElementById(
'product-weight'
)?.value.trim() || 0;

const sku =
document.getElementById(
'product-sku'
)?.value.trim() || '';

const imageInput =
document.getElementById(
'product-image'
);

if(
!name ||
!description ||
!price ||
!stock
){
alert('Lengkapi data produk');
return;
}

saveProductBtn.disabled=true;
saveProductBtn.innerText='Uploading...';

try{

let imageBase64='';

if(imageInput.files[0]){
imageBase64 =
await convertToBase64(
imageInput.files[0]
);
}

const response =
await fetch(
`${BASE_URL}/products`,
{
method:'POST',

headers:{
'Content-Type':'application/json',
Authorization:`Bearer ${token}`
},

body:JSON.stringify({

name,
description,
price:Number(price),
stock:Number(stock),

category,
condition,
weight:Number(weight),
sku,

images:[imageBase64],

productType:'physical',

seller:currentUser.id

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
'Produk berhasil ditambahkan'
);

document.getElementById(
'product-name'
).value='';

document.getElementById(
'product-description'
).value='';

document.getElementById(
'product-price'
).value='';

document.getElementById(
'product-stock'
).value='';

document.getElementById(
'product-category'
).value='';

document.getElementById(
'product-weight'
).value='';

document.getElementById(
'product-sku'
).value='';

document.getElementById(
'product-image'
).value='';

productModal.style.display='none';

loadSellerProducts();

}catch(error){

console.log(error);
alert('Server error');

}

saveProductBtn.disabled=false;
saveProductBtn.innerText='Upload Produk';

}
);

}

async function deleteProduct(id){

const confirmDelete =
confirm(
'Hapus produk ini?'
);

if(!confirmDelete) return;

try{

await fetch(
`${BASE_URL}/products/${id}`,
{
method:'DELETE',
headers:{
Authorization:
`Bearer ${token}`
}
}
);

loadSellerProducts();

}catch(error){
console.log(error);
}

}

window.deleteProduct =
deleteProduct;

function convertToBase64(file){

return new Promise(
(resolve,reject)=>{

const reader =
new FileReader();

reader.readAsDataURL(file);

reader.onload =
()=>resolve(reader.result);

reader.onerror =
error=>reject(error);

}
);

}

loadSellerProducts();
