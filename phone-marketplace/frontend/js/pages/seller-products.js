const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

const currentUser =
JSON.parse(localStorage.getItem('user'));

const token =
localStorage.getItem('token');

let productVariants = [];
let productsCache = [];
let editingProductId = null;

if (
!currentUser ||
currentUser.role !== 'seller'
){
window.location.href='login.html';
}

const productList =
document.getElementById('seller-product-list');

const productModal =
document.getElementById('product-modal');

const openModalBtn =
document.getElementById('open-product-modal');

const saveProductBtn =
document.getElementById('save-product-btn');

const addVariantBtn =
document.getElementById('add-variant-btn');

if(openModalBtn){
openModalBtn.addEventListener(
'click',
()=>{
editingProductId = null;
productVariants = [];
renderVariantList();
renderPrimaryVariantOptions();
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

if(addVariantBtn){
addVariantBtn.addEventListener(
'click',
async()=>{

const name =
document.getElementById('variant-name').value.trim();

const price =
document.getElementById('variant-price').value.trim();

const stock =
document.getElementById('variant-stock').value.trim();

const imageFile =
document.getElementById('variant-image').files[0];

if(!name || !price || !stock){
alert('Lengkapi data varian');
return;
}

let imageBase64='';

if(imageFile){
imageBase64 =
await convertToBase64(imageFile);
}

const newVariant = {
id: Date.now().toString(),
name,
price:Number(price),
stock:Number(stock),
image:imageBase64
};

productVariants = [
...productVariants,
newVariant
];

renderVariantList();
renderPrimaryVariantOptions();

document.getElementById('variant-name').value='';
document.getElementById('variant-price').value='';
document.getElementById('variant-stock').value='';
document.getElementById('variant-image').value='';

}
);
}

function renderPrimaryVariantOptions(){

const select =
document.getElementById('primary-variant-select');

if(!select) return;

select.innerHTML =
`<option value="">Pilih Variant Utama</option>`;

productVariants.forEach(variant=>{

select.innerHTML += `
<option value="${variant.id}">
${variant.name}
</option>
`;

});

}

function renderVariantList(){

const variantList =
document.getElementById('variant-list');

if(!variantList) return;

variantList.innerHTML =
productVariants.map((variant,index)=>`

<div style="
padding:12px;
margin-top:10px;
background:#f5f5f5;
border-radius:12px;
display:flex;
gap:12px;
align-items:center;
">

${variant.image ? `
<img
src="${variant.image}"
style="
width:50px;
height:50px;
object-fit:cover;
border-radius:8px;
"
/>
` : ''}

<div style="flex:1;">
<div><b>${variant.name}</b></div>
<div>Rp ${Number(variant.price || 0).toLocaleString('id-ID')}</div>
<div>Stok ${variant.stock || 0}</div>
</div>

<button
onclick="removeVariant(${index})"
style="
background:red;
color:white;
border:none;
padding:6px 10px;
border-radius:8px;
"
>x</button>

</div>

`).join('');

}

function removeVariant(index){
productVariants.splice(index,1);
productVariants = [...productVariants];
renderVariantList();
renderPrimaryVariantOptions();
}

window.removeVariant = removeVariant;
function openProductPreviewById(id){

const product =
productsCache.find(
item=>item._id===id
);

if(product){
openProductPreview(product);
}

}

window.openProductPreviewById =
openProductPreviewById;

function changePreviewImage(image, price, element){

const previewImage =
document.getElementById('preview-main-image');

if(previewImage){
previewImage.src = image;
}

const priceEl =
document.getElementById('preview-price');

if(priceEl){
priceEl.innerText =
`Rp ${Number(price || 0).toLocaleString('id-ID')}`;
}

document
.querySelectorAll('.variant-item')
.forEach(item=>{
item.classList.remove('active');
});

if(element){
element.classList.add('active');
}
}
window.changePreviewImage =
changePreviewImage;

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
console.log('STATUS:', response.status);
const data =
await response.json();
console.log('DATA:', data);
productsCache =
data.products ||
data.data?.products ||
data.data ||
[];

renderProducts(productsCache);

}catch(error){
console.log(error);
}

}

function renderProducts(products){

if(!products.length){

productList.innerHTML=`
<div class="empty-state">
Belum ada produk
</div>
`;

return;
}

productList.innerHTML =
products.map(product=>`

<div
class="product-card"
style="
display:flex;
flex-direction:column;
justify-content:space-between;
height:100%;
min-height:100%;
"
>

<div
onclick="openProductPreviewById('${product._id}')"
style="cursor:pointer;"
>

<img
src="${
product.images?.[0] ||
'https://via.placeholder.com/300'
}"
alt="${product.name}"
>

<h3>${product.name}</h3>

<p><b>${product.brand || '-'}</b></p>

<p>${
product.mainVariant ||
product.variants?.[0]?.name ||
'-'
}</p>

<p>
Rp ${Number(
product.price || 0
).toLocaleString('id-ID')}
</p>

<p>Stok: <b>${product.stock ?? 0}</b></p>
<p>Kategori: <b>${product.category || '-'}</b></p>
<p>Kondisi: <b>${product.condition || '-'}</b></p>
<p>SKU: <b>${product.sku || '-'}</b></p>
<p>Berat: <b>${product.weight || 0} gram</b></p>

</div>

<div style="
margin-top:auto;
padding-top:12px;
">

<button
onclick="event.stopPropagation();openProductPreviewById('${product._id}')"
style="
width:100%;
background:#111827;
color:white;
border:none;
padding:10px;
border-radius:12px;
font-weight:600;
margin-bottom:8px;
"
>
Preview
</button>

<div style="
display:flex;
gap:8px;
">

<button
onclick="event.stopPropagation();editProduct('${product._id}')"
style="
flex:1;
background:#f59e0b;
color:white;
border:none;
padding:10px;
border-radius:12px;
font-weight:600;
"
>
Edit
</button>

<button
onclick="event.stopPropagation();deleteProduct('${product._id}')"
style="
flex:1;
background:#dc2626;
color:white;
border:none;
padding:10px;
border-radius:12px;
font-weight:600;
"
>
Hapus
</button>

</div>
</div>
</div>

`).join('');

}

function openProductPreview(product){

const existing =
document.getElementById(
'product-preview-modal'
);

if(existing){
existing.remove();
}

document.body.insertAdjacentHTML(
'beforeend',
`
<div
id="product-preview-modal"
style="
position:fixed;
inset:0;
background:#fff;
z-index:999999;
overflow-y:auto;
padding:16px;
"
>

<div
onclick="closeProductPreview()"
style="
font-size:28px;
margin-bottom:12px;
cursor:pointer;
"
>←</div>

<img
id="preview-main-image"
src="${
product.images?.[0] ||
product.variants?.[0]?.image ||
''
}"
style="
width:100%;
height:320px;
object-fit:contain;
border-radius:18px;
margin-bottom:16px;
background:#fff;
"
/>

<h2>${product.name}</h2>

<p
id="preview-price"
style="
font-size:24px;
font-weight:700;
color:#ea580c;
margin:12px 0;
"
>
Rp ${Number(product.price || 0).toLocaleString('id-ID')}
</p>

<h3>Varian</h3>

<div
style="
display:flex;
gap:10px;
overflow-x:auto;
padding-bottom:10px;
margin-bottom:18px;
"
>

<div
onclick="changePreviewImage('${product.images?.[0] || ''}', '${product.price}', this)"
style="
min-width:72px;
cursor:pointer;
text-align:center;
"
>
<img
data-thumb="1"
src="${product.images?.[0] || ''}"
style="
width:64px;
height:64px;
object-fit:cover;
border-radius:12px;
border:2px solid #ff6b00;
"
/>
<div style="
font-size:12px;
margin-top:6px;
font-weight:600;
">
${product.mainVariant || 'Variant Utama'}
</div>
</div>

${product.variants?.map(v => `
<div
onclick="changePreviewImage('${v.image || product.images?.[0] || ''}', '${v.price || product.price}', this)"
min-width:72px;
cursor:pointer;
text-align:center;
"
>
<img
data-thumb="1"
src="${v.image || product.images?.[0] || ''}"
style="
width:64px;
height:64px;
object-fit:cover;
border-radius:12px;
border:1px solid #eee;
"
/>
<div style="
font-size:12px;
margin-top:6px;
">
${v.name}
</div>
</div>
`).join('') || ''}
</div>

<h3>Deskripsi Produk</h3>

<p style="
line-height:1.6;
color:#444;
">
${product.description || '-'}
</p>

<h3 style="
margin-top:20px;
">
Spesifikasi Produk
</h3>

<div style="
background:#f8f8f8;
padding:14px;
border-radius:14px;
">

<p>Brand: ${product.brand || '-'}</p>
<p>Kategori: ${product.category || '-'}</p>
<p>Kondisi: ${product.condition || '-'}</p>
<p>SKU: ${product.sku || '-'}</p>
<p>Berat: ${product.weight || 0} gram</p>
<p>Stok: ${product.stock || 0}</p>

</div>

</div>
`
);

}

function closeProductPreview(){

document
.getElementById(
'product-preview-modal'
)
?.remove();

}

window.openProductPreview =
openProductPreview;

window.closeProductPreview =
closeProductPreview;

function editProduct(id){

editingProductId = id;

const product =
productsCache.find(
item=>item._id===id
);

if(!product) return;

productModal.style.display='flex';

document.getElementById('product-name').value =
product.name || '';

document.getElementById('product-brand').value =
product.brand || '';

document.getElementById('product-main-variant').value =
product.mainVariant || '';

document.getElementById('product-description').value =
product.description || '';

document.getElementById('product-price').value =
product.price || '';

document.getElementById('product-stock').value =
product.stock || '';

document.getElementById('product-category').value =
product.category || '';

document.getElementById('product-sku').value =
product.sku || '';

document.getElementById('product-weight').value =
product.weight || '';

const conditionField =
document.getElementById('product-condition');

if(conditionField){
conditionField.value =
product.condition || 'Baru';
}

productVariants =
[...(product.variants || [])];

renderVariantList();
renderPrimaryVariantOptions();

}

window.editProduct = editProduct;

if(saveProductBtn){

saveProductBtn.addEventListener(
'click',
async()=>{

const name =
document.getElementById('product-name').value.trim();

const brand =
document.getElementById('product-brand')?.value.trim() || '';

const mainVariant =
document.getElementById('product-main-variant')?.value.trim() || '';

const description =
document.getElementById('product-description').value.trim();

const price =
document.getElementById('product-price').value.trim();

const stock =
document.getElementById('product-stock').value.trim();

const category =
document.getElementById('product-category')?.value.trim() || 'General';

const condition =
document.getElementById('product-condition')?.value || 'Baru';

const weight =
document.getElementById('product-weight')?.value.trim() || 0;

const sku =
document.getElementById('product-sku')?.value.trim() || '';

const imageInput =
document.getElementById('product-image');

const primaryVariantId =
document.getElementById('primary-variant-select')?.value;

const primaryVariant =
productVariants.find(
item => String(item.id) === String(primaryVariantId)
) || null;

const cleanVariants =
productVariants.map(v => ({
id: v.id || Date.now().toString(),
name: v.name || '',
price: Number(v.price || 0),
stock: Number(v.stock || 0),
image: v.image || ''
}));

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

if(
imageInput &&
imageInput.files[0]
){
imageBase64 =
await convertToBase64(
imageInput.files[0]
);
}

const product =
productsCache.find(
item=>item._id===editingProductId
);

const slug =
editingProductId
? product?.slug
: name.toLowerCase()
.trim()
.replace(/\s+/g,'-')
+ '-' +
Date.now();

const url =
editingProductId
? `${BASE_URL}/products/${editingProductId}`
: `${BASE_URL}/products`;

const method =
editingProductId
? 'PUT'
: 'POST';

await fetch(
url,
{
method,
headers:{
'Content-Type':'application/json',
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
name,
brand,
mainVariant,
slug,
description,
price:Number(price),
stock:Number(stock),
category,
condition,
weight:Number(weight),
sku,
variants:cleanVariants,
primaryVariant,
images: imageBase64
? [imageBase64]
: (
editingProductId
? product?.images || []
: []
),
productType:'physical',
seller:currentUser.id
})
}
);

alert(
editingProductId
? 'Produk berhasil diupdate'
: 'Produk berhasil ditambahkan'
);

editingProductId = null;
productVariants=[];

renderVariantList();
renderPrimaryVariantOptions();

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
confirm('Hapus produk ini?');

if(!confirmDelete) return;

try{

await fetch(
`${BASE_URL}/products/${id}`,
{
method:'DELETE',
headers:{
Authorization:`Bearer ${token}`
}
}
);

loadSellerProducts();

}catch(error){
console.log(error);
}

}

window.deleteProduct = deleteProduct;

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
