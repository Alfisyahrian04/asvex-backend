const PRODUCT_API =
'https://asvex-backend-production.up.railway.app/api/v1/products';

async function fetchProducts(){

try{

const response =
await fetch(PRODUCT_API);

if(!response.ok){

throw new Error(
'Failed fetch products'
);

}

const data =
await response.json();

/* PATCH START */
/* support semua bentuk response backend */

if(
Array.isArray(data)
){
return data;
}

if(
Array.isArray(data.products)
){
return data.products;
}

if(
Array.isArray(data.data)
){
return data.data;
}

if(
Array.isArray(data.data?.products)
){
return data.data.products;
}

return [];

/* PATCH END */

}catch(error){

console.log(
'FETCH PRODUCT ERROR:',
error
);

return [];

}

}

window.fetchProducts =
fetchProducts;
