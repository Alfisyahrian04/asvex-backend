function renderProductCard(product){

return `

<div class="product-card">

<div class="product-image">

<img
src="${
product.images?.[0] ||
'https://via.placeholder.com/300'
}"
alt="${product.name}"
/>

</div>

<div class="product-content">

<h3>
${product.name}
</h3>

<p class="product-category">
${product.category}
</p>

<p class="product-price">
Rp ${Number(product.price)
.toLocaleString('id-ID')}
</p>

<div class="product-rating">

⭐ ${product.rating || 0}
(
${product.reviewCount || 0}
)

</div>

<button
class="add-cart-btn"
onclick='addToCart(${JSON.stringify(product)})'
>

Tambah Keranjang

</button>

</div>

</div>

`;

}

window.renderProductCard =
renderProductCard;
