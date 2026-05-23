const params =
new URLSearchParams(
window.location.search
);

const id =
params.get('id');

const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

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
src="${image}"
class="detail-image"
>

<div class="detail-info">

<h1>
${product.name || 'Produk'}
</h1>

<div class="detail-price">

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

<button
class="btn-primary"
id="add-cart-btn"
>

+ Tambah Keranjang

</button>

</div>

</div>

`;

const addCartBtn =
document.getElementById(
'add-cart-btn'
);

if(
addCartBtn
){

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

const existingProduct =
cart.find(
item =>
item._id ===
product._id
);

if(
existingProduct
){

existingProduct.quantity =
(existingProduct.quantity || 1) + 1;

}else{

cart.push({

...product,
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
