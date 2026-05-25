protectPage();

const params =
new URLSearchParams(
window.location.search
);

const productId =
params.get('id');

const reviewList =
document.getElementById(
'review-list'
);

/* PATCH */
const variantContainer =
document.getElementById(
'variant-list'
);

const addCartBtn =
document.getElementById(
'add-cart-btn'
);
/* PATCH */

let currentProduct = null;

async function loadReviews(){

try{

const reviews =
await getProductReviews(
productId
);

renderReviews(
reviews
);

}catch(error){

console.log(error);

}

}

function renderReviews(reviews){

if(!reviewList) return;

reviewList.innerHTML =
reviews.map(review=>`

<div class="review-card">

<h3>
${review.user?.username}
</h3>

<p>
⭐ ${review.rating}
</p>

<p>
${review.comment}
</p>

</div>

`).join('');

}

/* PATCH START */

function renderVariants(product){

if(
!variantContainer ||
!product?.variants?.length
) return;

variantContainer.innerHTML =
product.variants.map(
variant=>`

<button
class="variant-btn"
data-variant='${JSON.stringify(variant)}'
>
${variant.color || ''}
${variant.storage || ''}
${variant.ram || ''}
${variant.rom || ''}
</button>

`
).join('');

}

async function loadProductDetail(){

try{

const product =
await fetchProductById(
productId
);

currentProduct = product;

renderVariants(product);

bindAddToCart(product);

}catch(error){

console.log(error);

}

}

function bindAddToCart(product){

if(!addCartBtn) return;

addCartBtn.onclick =
function(){

const cart =
cartStore.getCart();

const existing =
cart.find(
item =>
item._id === product._id
);

const stock =
Number(
product.stock || 0
);

const qtyInCart =
Number(
existing?.quantity || 0
);

if(
stock > 0 &&
qtyInCart >= stock
){

alert(
'Stok tidak mencukupi'
);

return;

}

cartStore.addToCart(
product
);

alert(
'Produk ditambahkan'
);

};

}

/* PATCH END */

async function submitReview(){

try{

const rating =
document.getElementById(
'review-rating'
).value;

const comment =
document.getElementById(
'review-comment'
).value;

await createReview({

productId,
rating,
comment

});

alert(
'Review berhasil dikirim'
);

loadReviews();

}catch(error){

alert(
'Gagal kirim review'
);

}

}

loadReviews();
loadProductDetail();
