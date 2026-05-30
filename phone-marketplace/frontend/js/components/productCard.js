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

<p class="product-category">
${product.category || '-'}
</p>

<h3>
${product.name}
</h3>

<p class="product-price">
Rp ${Number(product.price || 0)
.toLocaleString('id-ID')}
</p>

<div class="product-rating">
⭐ ${product.rating || 0}
(${product.reviewCount || 0})
</div>

<button
class="${
Number(product.stock || 0) <= 0
? 'out-of-stock-btn'
: 'add-cart-btn'
}"
${
Number(product.stock || 0) <= 0
? 'disabled'
: `onclick='addToCart(${JSON.stringify(product)})'`
}
>
${
Number(product.stock || 0) <= 0
? 'Stok Habis'
: 'Tambah Keranjang'
}
</button>

</div>

</div>

`;

}

window.renderProductCard =
renderProductCard;
