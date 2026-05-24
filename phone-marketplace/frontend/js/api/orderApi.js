const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1/orders';

async function createOrder(data){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
BASE_URL,
{
method:'POST',

headers:{
'Content-Type':
'application/json',

Authorization:
`Bearer ${token}`
},

body:JSON.stringify(data)

}
);

let result;

try{

result =
await response.json();

}catch{

result = null;

}

if(!response.ok){

console.error(
'ORDER CREATE ERROR:',
result
);

throw new Error(
result?.message ||
result?.error ||
`Checkout gagal (${response.status})`
);

}

return result;

}

async function fetchMyOrders(){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
`${BASE_URL}/my-orders`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const data =
await response.json();

if(!response.ok){

throw new Error(
data.message ||
'Gagal mengambil order'
);

}

return data;

}

/* PATCH START */

async function completeOrder(id){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
`${BASE_URL}/${id}/complete`,
{
method:'PUT',
headers:{
Authorization:
`Bearer ${token}`
}
}
);

return response.json();

}

async function cancelOrder(id){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
`${BASE_URL}/${id}/cancel`,
{
method:'PUT',
headers:{
Authorization:
`Bearer ${token}`
}
}
);

return response.json();

}

async function requestReturn(id){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
`${BASE_URL}/${id}/return`,
{
method:'PUT',
headers:{
Authorization:
`Bearer ${token}`
}
}
);

return response.json();

}

/* PATCH END */
