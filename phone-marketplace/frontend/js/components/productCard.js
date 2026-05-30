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
  ${
    Number(product.stock || 0) <= 0
      ? 'disabled'
      : `onclick='addToCart(${JSON.stringify(product)})'`
  }
  style="
    width:100%;
    height:44px;
    border:none;
    border-radius:14px;
    font-size:16px;
    font-weight:600;
    cursor:${
      Number(product.stock || 0) <= 0
        ? 'not-allowed'
        : 'pointer'
    };
    background:${
      Number(product.stock || 0) <= 0
        ? '#e5e7eb'
        : 'linear-gradient(135deg,#2563eb,#3b82f6)'
    };
    color:${
      Number(product.stock || 0) <= 0
        ? '#6b7280'
        : '#fff'
    };
    opacity:1;
  "
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
