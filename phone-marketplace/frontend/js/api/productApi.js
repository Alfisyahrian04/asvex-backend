const PRODUCT_API =
'https://asvex-backend-production.up.railway.app/api/v1/products';

async function fetchProducts(){

const response =
await fetch(
PRODUCT_API
);

if(!response.ok){

throw new Error(
'Failed fetch products'
);

}

const data =
await response.json();

return data.products || data;

}

window.fetchProducts =
fetchProducts;
