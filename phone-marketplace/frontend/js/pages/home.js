protectPage();

const productContainer =
document.getElementById(
'product-list'
);

const cartCount =
document.getElementById(
'cart-count'
);

const categoryButtons =
document.querySelectorAll(
'.category'
);

let allProducts = [];

async function loadProducts(){

try{

const products =
await fetchProducts();

allProducts =
products;

productStore.setProducts(
products
);

renderProducts(
products
);

}catch(error){

productContainer.innerHTML = `

<div class="empty-product">

Belum ada produk

</div>

`;

}

}

function renderProducts(products){

if(!products.length){

productContainer.innerHTML = `

<div class="empty-product">

Produk kosong

</div>

`;

return;

}

productContainer.innerHTML =
products.map(product=>
renderProductCard(product)
).join('');

}

window.addToCart =
function(product){

cartStore.addToCart(
product
);

updateCartCount();

alert(
'Produk ditambahkan'
);

};

function updateCartCount(){

cartCount.innerText =
cartStore.getCartCount();

}

categoryButtons.forEach(button=>{

button.addEventListener(
'click',
()=>{

document
.querySelector(
'.category.active'
)
.classList.remove(
'active'
);

button.classList.add(
'active'
);

const category =
button.innerText;

if(category === 'Semua'){

renderProducts(
allProducts
);

return;

}

const filtered =
allProducts.filter(
product =>
product.category
.toLowerCase() ===
category.toLowerCase()
);

renderProducts(
filtered
);

}
);

});

updateCartCount();

loadProducts();
