protectPage();

const productContainer =
document.getElementById(
'product-list'
);

const recommendationContainer =
document.getElementById(
'recommendation-list'
);

const trendingContainer =
document.getElementById(
'trending-list'
);

const cartCount =
document.getElementById(
'cart-count'
);

const categoryButtons =
document.querySelectorAll(
'.category'
);

const token =
localStorage.getItem(
'token'
);

let allProducts = [];

document.getElementById(
'search-bar'
).innerHTML =
renderSearchBar();

const searchInput =
document.getElementById(
'search-input'
);

const sortSelect =
document.getElementById(
'sort-select'
);

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

async function loadTrending(){

try{

const response =
await fetch(
'https://asvex-backend-production.up.railway.app/api/v1/products/trending'
);

const products =
await response.json();

renderTrending(
products
);

}catch(error){

console.log(error);

}

}

async function loadRecommendations(){

try{

const response =
await fetch(
'https://asvex-backend-production.up.railway.app/api/v1/products/recommendations',
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const products =
await response.json();

renderRecommendations(
products
);

}catch(error){

console.log(error);

}

}

function renderTrending(products){

trendingContainer.innerHTML =
products.map(product=>
renderProductCard(product)
).join('');

}

function renderRecommendations(products){

recommendationContainer.innerHTML =
products.map(product=>
renderProductCard(product)
).join('');

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

async function handleSearch(){

const keyword =
searchInput.value;

const sort =
sortSelect.value;

const response =
await fetch(

`https://asvex-backend-production.up.railway.app/api/v1/search?keyword=${keyword}&sort=${sort}`

);

const products =
await response.json();

renderProducts(
products
);

}

searchInput.addEventListener(
'input',
handleSearch
);

sortSelect.addEventListener(
'change',
handleSearch
);

updateCartCount();

loadProducts();

loadTrending();

loadRecommendations();
