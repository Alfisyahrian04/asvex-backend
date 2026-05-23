protectPage();

const token =
localStorage.getItem(
'token'
);

const API_URL =
'https://asvex-backend-production.up.railway.app/api/v1/products';

const container =
document.getElementById(
'wishlist-container'
);

async function loadWishlist(){

try{

const response =
await fetch(
`${API_URL}/wishlist/me`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const products =
await response.json();

renderWishlist(
products
);

}catch(error){

console.log(error);

}

}

function renderWishlist(products){

if(!products.length){

container.innerHTML = `

<div class="empty-product">

Wishlist kosong

</div>

`;

return;

}

container.innerHTML =
products.map(product=>`

<div class="product-card">

<div class="product-image">

<img
src="${
product.images?.[0]
}"
alt="${product.name}"
>

</div>

<div class="product-content">

<h3>
${product.name}
</h3>

<p class="product-price">

Rp ${Number(product.price)
.toLocaleString('id-ID')}

</p>

<div class="wishlist-actions">

<button
onclick='addToCart(${JSON.stringify(product)})'
>

Keranjang

</button>

<button
onclick="
removeWishlist(
'${product._id}'
)
"
>

Hapus

</button>

</div>

</div>

</div>

`).join('');

}

window.addToCart =
function(product){

cartStore.addToCart(
product
);

alert(
'Produk ditambahkan'
);

};

async function removeWishlist(id){

await fetch(
`${API_URL}/wishlist/${id}`,
{
method:'POST',

headers:{
Authorization:
`Bearer ${token}`
}
}
);

loadWishlist();

}

loadWishlist();
