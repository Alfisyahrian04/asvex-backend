const params =
new URLSearchParams(
window.location.search
);

const id =
params.get('id');

const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

let selectedVariant = null;

async function loadProduct(){

try{

const response =
await fetch(
`${BASE_URL}/products/${id}`
);

const product =
await response.json();

if(
!response.ok ||
!product
){

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

renderProduct(
product
);

}catch(error){

console.error(
error
);

document.getElementById(
'product-detail'
).innerHTML =

`
<h2>
Gagal memuat produk
</h2>
`;

}

}

function renderProduct(
product
){

const image =
product.images?.[0]
||
'https://via.placeholder.com/500x500';

document.getElementById(
'product-detail'
).innerHTML =

`

<div class="detail-card">

<img
id="main-product-image"
src="${image}"
class="detail-image"
>

<div class="detail-info">

<h1>
${product.name || 'Produk'}
</h1>

<div
id="product-price"
class="detail-price"
>
Rp ${Number(
product.price || 0
).toLocaleString(
'id-ID'
)}
</div>

<div class="detail-rating">
⭐ ${product.rating || 0}
• ${product.reviewCount || 0} Review
</div>

<p class="detail-desc">
${product.description || 'Tidak ada deskripsi'}
</p>

${
product.variants?.length
? `
<div
class="variant-wrapper"
style="
display:flex;
gap:8px;
overflow-x:auto;
margin:16px 0;
"
>
${product.variants.map((variant,index)=>`
<button
class="variant-btn"
data-index="${index}"
style="
padding:8px 14px;
border-radius:10px;
border:1px solid #ddd;
background:white;
cursor:pointer;
white-space:nowrap;
"
>
${variant.name}
</button>
`).join('')}
</div>
`
: ''
}

<div
id="product-stock"
style="
margin-bottom:12px;
font-weight:600;
"
>
Stok:
${product.stock || 0}
</div>

<button
class="btn-primary"
id="add-cart-btn"
>
+ Tambah Keranjang
</button>

</div>

</div>

`;

if(product.variants?.length){

document
.querySelectorAll('.variant-btn')
.forEach(btn=>{

btn.addEventListener(
'click',
()=>{

const index =
btn.dataset.index;

selectedVariant =
product.variants[index];

document
.querySelectorAll(
'.variant-btn'
)
.forEach(
b=>b.style.border='1px solid #ddd'
);

btn.style.border =
'2px solid #2563eb';

document.getElementById(
'product-price'
).innerHTML =
`Rp ${Number(
selectedVariant.price || product.price
).toLocaleString('id-ID')}`;

document.getElementById(
'product-stock'
).innerHTML =
`Stok: ${
selectedVariant.stock || 0
}`;

if(selectedVariant.image){
document.getElementById(
'main-product-image'
).src =
selectedVariant.image;
}

}
);

});

}

const addCartBtn =
document.getElementById(
'add-cart-btn'
);

if(addCartBtn){

addCartBtn.addEventListener(
'click',
()=>{

addToCart(
product
);

}
);

}

}

window.addToCart =
function(product){

let cart =
JSON.parse(
localStorage.getItem(
'cart'
)
) || [];

const stockAvailable =
selectedVariant
? Number(selectedVariant.stock || 0)
: Number(product.stock || 0);

if(stockAvailable <= 0){
alert('Stok habis');
return;
}

const cartId =
selectedVariant
? `${product._id}-${selectedVariant.name}`
: product._id;

const existingProduct =
cart.find(
item =>
item.cartId === cartId
);

if(existingProduct){

if(
existingProduct.quantity >=
stockAvailable
){
alert(
'Qty melebihi stock tersedia'
);
return;
}

existingProduct.quantity += 1;

}else{

cart.push({

...product,

cartId,

variant:
selectedVariant || null,

price:
selectedVariant?.price ||
product.price,

image:
selectedVariant?.image ||
product.images?.[0],

quantity:1

});

}

localStorage.setItem(
'cart',
JSON.stringify(
cart
)
);

alert(
'Produk masuk keranjang'
);

};

loadProduct();
